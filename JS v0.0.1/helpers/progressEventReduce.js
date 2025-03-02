/**
 * decorate a fn to dispatch progress events baed on streamed data
 * @param {Function} callback the fn to invoke with progress updates
 * @returns {Function} a callback functon that tracks progress
 */
export function progressEventReducer(callback) {
    return (loaded, total) => {
        if(callback) {
            callback({loaded, total, progress: total ? loaded / total : 0})
        }
    }
}