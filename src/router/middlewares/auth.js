import { useAdminUserStore } from 'stores/admin_user'
export default function auth({ next }) {
    const store = useAdminUserStore()
    if (!store.isLoggedIn) {
        return next({ name: 'adminLogin' })
    }
    return next()
}