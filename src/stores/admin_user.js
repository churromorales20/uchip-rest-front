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
        admin_menu_items: []
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
            console.log('PUCALPA');
            this.admin_menu_items = menuConstructor(response.menu_items, 0);
            console.log(this.admin_menu_items);
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
            }
            catch (error) {
                console.log(error)
            }
            this.is_loggin = false;
        }
    },
});
