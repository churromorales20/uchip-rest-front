import { defineStore } from 'pinia';
const updateUserDataLocalStorage = (user_data) => {
    localStorage.setItem("user_data", JSON.stringify(user_data));
}

export const useUserStore = defineStore('user', {
    state: () => ({
        name: '',
        email: '',
        phone: '',
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
        loadData(){
            const data_stored = localStorage.getItem("user_data");
            const data_obj = data_stored !== null && data_stored != '' ? JSON.parse(data_stored) : {
                name: '',
                email: '',
                phone: '',
            };
            this.name = data_obj.name;
            this.email = data_obj.email;  
            this.phone = data_obj.phone;
        }
    },
});
