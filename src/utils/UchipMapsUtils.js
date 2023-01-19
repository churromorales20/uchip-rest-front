import axios from "axios"
class UchipMapsUtils {
    constructor() {
        this.api_path = 'https://maps.googleapis.com/maps/api/';
        this.key_api = 'AIzaSyDm4yrRIMWTAYNcmNy97OmU0E2dPuiaing'; //TODO: Get this value from env file
    }

    async reverseGeocode(lat, lng) {
        const data_response = await axios.get(this.api_path + 'geocode/json?latlng=' + lat + ',' + lng + '&key=' + this.key_api);
        //console.log('CHURRRO', data_response);
        return typeof data_response?.data?.results[0].formatted_address === "string" ? data_response?.data?.results[0].formatted_address : '';
        //return data_response.data;
    }
    /*async autocomplete(term) {
        axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', {
            params: {
                input: 'Eiffel Tower',
                inputtype: 'textquery',
                fields: 'photos,formatted_address,name,rating,opening_hours,geometry',
                key: this.key_api
            }
        }).then(response => {
            console.log(response.data)
        }).catch(error => {
            console.log(error)
        })
        //return typeof data_response?.data?.results[0].formatted_address === "string" ? data_response?.data?.results[0].formatted_address : '';
        //return data_response.data;
    }*/
}
const uchipMapUtils = new UchipMapsUtils();

// 👇️ named export (same as previous code snippet)
export { uchipMapUtils };