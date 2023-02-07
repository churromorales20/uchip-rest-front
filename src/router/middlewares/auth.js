import { useAdminUserStore } from 'stores/admin_user'
export default async function auth({ next }) {
    const store = useAdminUserStore()
    if (!store.isLoggedIn) {
        await store.checkUser();
        if (!store.isLoggedIn) {
            return next({ name: 'adminLogin' });
        }
    }
    return next()
}