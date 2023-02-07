import axios from "axios"
class UchipRequest {
    constructor() {
        //this.api_path = 'http://localhost:8000/api/'; //TODO: Get this value from env file
        this.axios = axios.create({
            withCredentials: true,
            baseURL: 'http://localhost:8000/api/'
        })
    }
    async loadCsrfCookie(){
        console.log('LLMAAAAMOMOOOO');
        const data_response = await axios.get('http://localhost:8000/sanctum/csrf-cookie');
        console.log(data_response);
        return data_response.data;
    }
    async get(end_point, data_request){
        let data = [];
        if (typeof data_request === 'object'){
            for (const [name, value] of Object.entries(data_request)) {
                data.push(name + '=' + value)
            }
        }
        const data_response = await this.axios.get(end_point + (data.length == 0 ? '' : '?' + data.join('&')));
        return data_response.data;
    }

    async post(end_point, data){
        //let data = [];
        const data_response = await this.axios.post(end_point, JSON.stringify(data), {
            headers: {
                // Overwrite Axios's automatically set Content-Type
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