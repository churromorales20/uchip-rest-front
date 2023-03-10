/**
 * A stack of different middlewares ran in series
 * Link: https://blog.logrocket.com/vue-middleware-pipelines/
 */
function middlewarePipeline(context, middlewares, index) {
    let middleware = middlewares[index]
    if (!middleware) return context.next
    return async () => {
        let nextMiddleware = middlewarePipeline(
            context, middlewares, index + 1
        )
        await middleware({ ...context, next: nextMiddleware })
    }
}

export default middlewarePipeline