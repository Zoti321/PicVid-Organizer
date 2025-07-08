import axios from "axios";
import {ElMessage} from "element-plus";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8080",
    timeout: 5000,
});

// 请求拦截器
axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    }
)
// 响应拦截器
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        ElMessage({
            message: `请求错误, 错误信息: ${error}`,
            type: "error",
        })
        return Promise.reject(error);
    }
)

export default axiosInstance;


