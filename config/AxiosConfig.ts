import axios from "axios";
import Cookies from 'js-cookie'


const token = Cookies.get('cookie-todo')
console.log(6, token);

const axiosConfig =  axios.create({
        baseURL: 'http://localhost:4000'
});

axiosConfig.defaults.headers.common['Authorization'] =   `Bearer ${token}` ;
export default axiosConfig