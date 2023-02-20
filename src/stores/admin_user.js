import { defineStore } from 'pinia';
import { uchipRequest } from '../utils/uchipRequest';   
import { menuConstructor } from '../utils/userAdmin';   
const updateUserDataLocalStorage = (user_data) => {
    localStorage.setItem("user_data", JSON.stringify(user_data));
}

export const useAdminUserStore = defineStore('admin_user', {
    state: () => ({
        name: '',
        email: '',
        logging_email: '',
        logging_password: '',
        phone: '',
        is_logged_in: false,
        is_loggin: false,
        csrf_loaded: false,
        admin_menu_items: [],
        bread_crumbs: [],
        user_current_path: ''
    }),
    getters: {
        isValidForOrder: (state) => {
            return state.name != '' && state.email != '' && state.phone;
        },
        dataObject: (state) => {
            return {
                name: state.name,
                email: state.email,
                phone: state.phone,
            }
        },
        isLoggedIn: (state) => {
            return state.is_logged_in;
        },
        isLoggingIn: (state) => {
            return state.is_loggin;
        },
        isCsrfLoaded: (state) => {
            return state.csrf_loaded;
        },
        navigationBreadCrumbs: (state) => {
            return state.bread_crumbs === null ? [] : [{
                title: 'Home',
                icon: 'fa-solid fa-home',
                id: 200,
                link: ''
            }].concat(state.bread_crumbs);
        },
        menuItems: (state) => {
            return state.admin_menu_items;
        }
    },
    actions: {
        saveUserData(){
            updateUserDataLocalStorage({
                name: this.name,
                email: this.email,
                phone: this.phone,
            })
        },
        setBreadCrumbs(path){
            path = path === undefined ? this.user_current_path : path;
            if (this.is_logged_in){
                const getBreadCrumb = (items, result) => {
                    //console.log('items');
                    //console.log(items);
                    let item_found = null;
                    for (let index = 0; index < items.length; index++) {
                        const item_menu = items[index];
                        if ('/admin/' + item_menu.link == path) {
                            return result.concat([item_menu]);
                        } else if (Array.isArray(item_menu.children) && item_menu.children.length > 0) {
                            const bread_crumbs = getBreadCrumb(item_menu.children, result.concat([item_menu]));
                            if (bread_crumbs !== null){
                                return bread_crumbs;
                            }
                        }
                    }
                    return null;
                }
                //console.log('path', path);
                this.bread_crumbs = getBreadCrumb(this.admin_menu_items, []);
                //console.log(this.admin_menu_items);
            }
        },
        async loadCsrfCookie(){
            try {
                const data = await uchipRequest.loadCsrfCookie();
                this.csrf_loaded = true;
                /*if (data.status == 'success') {
                    this.products_map = data.home;
                }*/
                //this.loaded = true;
            }
            catch (error) {
                console.log(error)
            }
        },
        
        setUserData(response){
            this.admin_menu_items = menuConstructor(response.menu_items, 0);
            //console.log('USER DATA');
            //this.setBreadCrumbs();
            if(response?.token !== undefined){
                localStorage.setItem("user_admin_token", response.token);
            }
        },
        async makeLogin(){
            this.is_loggin = true;
            try {
                const data = await uchipRequest.post('auth/login', {
                    email: 'cecilio.dev@gmail.com',
                    password: 'P1churr1t0**'
                });
                //this.csrf_loaded = true;
                if (data.status == 'success') {
                    this.is_logged_in = true;
                    this.setUserData(data);
                    this.router.push({ name: 'adminDashboard'});
                }
                //this.loaded = true;
            }
            catch (error) {
                console.log(error)
            }
            this.is_loggin = false;
        },
        async checkUser(){
            try {
                const data = await uchipRequest.get('auth/user');
                if (data.status == 'success') {
                    this.is_logged_in = true;
                    this.setUserData(data);
                }
                this.csrf_loaded = true;
            }
            catch (error) {
                console.log(error);
                this.csrf_loaded = true;
            }
            this.is_loggin = false;
        }
    },
});
