import axios from "axios"
class UchipRequest {
    constructor() {
        this.api_path = 'http://localhost:8000/api/'; //TODO: Get this value from env file
    }

    async get(end_point, data_request){
        let data = [];
        if (typeof data_request === 'object'){
            for (const [name, value] of Object.entries(data_request)) {
                data.push(name + '=' + value)
            }
        }
        const data_response = await axios.get(this.api_path + end_point + (data.length == 0 ? '' : '?' + data.join('&')));
        return data_response.data;
    }

    async post(end_point, data){
        //let data = [];
        const data_response = await axios.post(this.api_path + end_point, JSON.stringify(data), {
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