import axiosInstance from "../axiosInstance"


const getCities = ()=>{

   return axiosInstance.get('utils/get_cities',{})
}


const getService = {getCities}

export default getService