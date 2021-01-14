import axios from 'axios';

export const getLocation: (lat: Number,lng: Number)=> Promise<any> = (lat,lng) =>{
    const locationUrl =`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBtD2eMhmD8HDlcNbrsoWS2hi-6iy130CU`
    return axios({
        method: 'get',
        url: locationUrl,

        headers: {
            'Content-Type': 'application/json',
        },
      });
}
