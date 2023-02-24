
import { boot } from 'quasar/wrappers'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
export default boot(({ app }) => {
    window.Pusher = Pusher
    const echo = new Echo({
        broadcaster: 'pusher',
        key: 'ASDASD4540',
        cluster: '',
        forceTLS: false,
        encrypted: false,
        wsHost: window.location.hostname,
        wssPort: 6001,
        wsPort: 6001,
        disableStats: true,
        enabledTransports: ['ws'],
    })
    app.config.globalProperties.$echo = echo;
})
