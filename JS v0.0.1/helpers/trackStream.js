/**
 * split a binary chunk into smaller chunks of a specified size
 * @param {Uint8Array} chunk binary data chunk
 * @param {number} chunkSize size of each smaller chunk
 * @returns {Generator<Uint8Array>} a generator yielding smaller chunks
 */
export function* streamChunk(chunk, chunkSize) {
    let len = chunk.byteLength;

    if(!chunkSize || len < chunkSize) {
        yield chunk;
        return;
    }

    let position = 0;
    while(position < len) {
        yield chunk.slice(position, position + chunkSize);
        position += chunkSize;
    }
}

/**
 * read an async iterable stream and yields its content in chunks
 * @param {AsyncIterable<Uint8Array> | ReadableStream} iterable the source stream
 * @param {number} chunkSize the size of each chunk
 * @returns {AsyncGenerator<Uint8Array>} an async generator yielding chunks
 */
export async function* readBytes(iterable, chunkSize) {
    for await (const chunk of readStream(iterable, chunkSize)) {
        yield* streamChunk(chunk, chunkSize);
    }
}

/**
 * reads a readable stream and yields chunks of data
 * @param {ReadableStream} stream the input readable stream
 * @returns {AsyncGenerator<Uint8Array>} an async generator yielding chunks
 */
async function* readStream(stream) {
    if(stream[Symbol.asyncIterator]) {
        yield* stream;
        return;
    }

    const reader = stream.getReader();
    try {
        while(true) {
            const {done, val} = await reader.read();
            if(done) break;
            yield val;
        }
    } finally {
        await reader.cancel();
    }
}

/**
 * wrap a stream to track progress and report completion
 * @param {ReadableStream} stream the input stream
 * @param {number} chunkSize the size of each chunk
 * @param {Function} [onProgress] callback for progress updates
 * @param {Function} [onFinish] callback for completon
 * @returns {ReadableStream} a new readable stream wth tracking
 */
export function trackStream(stream, chunkSize, onProgress, onFinish) {
    const iterator = readBytes(stream, chunkSize);
    let bytesRead = 0;
    let completed = false;

    const handleFinish = e => {
        if(!completed) {
            completed = true;
            if(onFinish) onFinish(e);
        }
    };

    return new ReadableStream({
        async pull(controller) {
            try {
                const {done, val} = await iterator.next();
                if(done) {
                    handleFinish();
                    controller.close();
                    return;
                }
                bytesRead += val.byteLength;
                if(onProgress) onProgress(bytesRead);
                controller.enqueue(new Uint8Array(val));
            } catch(e) {
                handleFinish(e);
                throw e;
            }
        },
        cancel(reason) {
            handleFinish(reason);
            return iterator.return();
        }
    }, {highWaterMark: 2});
}