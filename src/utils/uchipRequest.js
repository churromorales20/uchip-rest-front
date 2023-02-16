import axios from "axios"
class UchipRequest {
    constructor() {
        //this.api_path = 'http://localhost:8000/api/'; //TODO: Get this value from env file
        this.axios = axios.create({
            //withCredentials: true,
            baseURL: 'https://uchip.artisanburgers.pe/api/'
            //baseURL: 'http://localhost:8000/api/'
        })
    }
    async loadCsrfCookie(){
        const data_response = await axios.get('https://uchip.artisanburgers.pe/sanctum/csrf-cookie');
        return data_response.data;
    }
    async get(end_point, data_request){
        let data = [];
        if (typeof data_request === 'object'){
            for (const [name, value] of Object.entries(data_request)) {
                data.push(name + '=' + value)
            }
        }
        const user_admin_token = localStorage.getItem("user_admin_token");
        const data_response = await this.axios.get(end_point + (data.length == 0 ? '' : '?' + data.join('&')),{
            headers: user_admin_token !== null ? {
                'Authorization': `Bearer ${user_admin_token}`,
                'Content-Type': 'application/json'
            } : {
                'Content-Type': 'application/json'
            }
        });
        return data_response.data;
    }

    async post(end_point, data){
        //let data = [];
        const user_admin_token = localStorage.getItem("user_admin_token");
        const data_response = await this.axios.post(end_point, JSON.stringify(data), {
            headers: user_admin_token !== null ? {
                'Authorization': `Bearer ${user_admin_token}`,
                'Content-Type': 'application/json'
            } : {
                'Content-Type': 'application/json'
            }
        });
        console.log(data_response.data);
        return data_response.data;
    }
}
const uchipRequest = new UchipRequest();

// 👇️ named export (same as previous code snippet)
export { uchipRequest };