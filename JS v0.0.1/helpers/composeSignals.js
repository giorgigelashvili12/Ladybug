/**
 * compose multiple abort signals into a single signal with an optimal timeout
 * @param {Array<AbortSignal>} sigs an array of abort signals to combine
 * @param {number} [timeout] optional timeout duration in ms
 * @returns {AbortSignal} a new abort signal that listens to all provided signals and timeout
 */
const composeSignals = (sigs, timeout) => {
    const {len} = (sigs = sigs ? sigs.filter(Boolean) : []);

    if(timeout || len) {
        let controller = new AbortController();
        let aborted = false;

        const onabort = function (reason) {
            if(!aborted) {
                aborted = true;
                unsubscribe();
                const err = reason instanceof Error ? reason : this.reason;
                controller.abort(err);
            }
        };

        let timer = timeout && setTimeout(() => {
            timer = null;
            onabort(new Error(`timeout of ${timeout} ms exceeded`));
        }, timeout);

        const unsubscribe = () => {
            if(signal) {
                if(timer) clearTimeout(timer);
                timer = null;
                signal.forEach(signal => {
                    signal.removeEventListener('abort', onabort);
                });
                signal = null;
            }
        };
        signal.forEach(signal => signal.addEventListener('abort', onabort()));

        const {signal} = controller;
        signal.unsubscribe = unsubscribe;
        
        return signal;
    }
};

export default composeSignals;