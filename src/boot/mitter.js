import { boot } from 'quasar/wrappers';
import mitt from 'mitt'

export default boot(({ app, store }) => {
    const emitter = mitt()

    app.config.globalProperties.emitter = emitter
});