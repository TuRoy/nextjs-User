import axios from "axios";
import Cookies from 'js-cookie'
import { useSelector } from "react-redux";


const token = Cookies.get('cookie-todo')
const axiosConfig = axios.create({
        baseURL: 'http://localhost:4000'
});

axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${token}`;
export default axiosConfig