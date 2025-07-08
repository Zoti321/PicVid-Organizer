import axiosInstance from "./index.js";
import {ElMessage} from "element-plus";
import axios from "axios";


const categoryTagsAPI = {
    // 请求分类标签数据
    getAllCategoryTags: async () => {
        let loaded
        try {
            const response = await axiosInstance.get("/api/comic/get-category-tags-list/")
            const data = response.data
            loaded = true
            return {data, loaded}
        }
        catch (error) {
            ElMessage({
                message: `请求分类标签数据错误, 错误信息: ${error}`,
                type: "error",
            })
            loaded = false
            return {loaded}
        }
    },
    // 获取数量最多的三个分类标签
    getCategoryTagsNumber: async () => {
        let success
        try {
            const response = await axiosInstance.get("/api/comic/get-category-tags-count/")
            const data = response.data
            success = true

            return {data, success}
        }
        catch (error) {
            ElMessage({
                message: `请求分类标签排行榜数据失败，错误信息: ${error}`,
                type: "error"
            })
            success = false

            return {success}
        }
    },
    // 添加分类标签
    postAddCategoryTags: async (data) => {
        let success
        try {
            const response = await axiosInstance.post(
                "/api/comic/post-add-tag/",
                data,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            ElMessage({
                message: "添加分类标签成功",
                type: "success"
            })
            success = true
            return {success}
        }
        catch (error) {
            ElMessage({
                message: `添加分类标签失败, ${error}`,
                type: "error"
            })
            success = false
            return {success}
        }
    },
    // 添加分类标签到指定漫画
    postAddCategoryTagToComic: async (data)=> {
        let success
        try {
            const response = await axiosInstance.post(
                "/api/comic/post-add-tag-to-comic/",
                data,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            ElMessage({
                message: `添加${data.type}成功`,
                type: "success"
            })
            success = true
            return {success}
        }
        catch (error) {
            ElMessage({
                message: `添加${data.type}失败, 错误信息:${error}`,
                type: "error"
            })
            success = false
            return {success}
        }
    },
    // 从漫画中移除分类标签
    removeCategoryTag: async (data) => {
        let success
        try {
            await axiosInstance.delete(
                "/api/comic/delete-tag-from-comic/",
                {data}
            )
            ElMessage({
                message: "移除分类标签成功",
                type: "success"
            })
            success = true

            return {success}
        }
        catch (error) {
            ElMessage({
                message: `移除分类标签失败, 错误信息: ${error}`,
                type: "error"
            })
            success = false

            return {success}
        }
    }
}

export default categoryTagsAPI

