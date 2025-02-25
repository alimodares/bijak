import axiosInstance from "../axiosInstance"

const getpricing = () => {
    return axiosInstance.post('utils/single_pricing',{})
}
const postService = {getpricing}

export default postService