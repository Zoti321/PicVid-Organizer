import axiosInstance from "./index.js";
import {ElMessage} from "element-plus";
import axios from "axios";


const comicAPI = {
    // 请求漫画卡片数据
    getComicCardsData: async () => {
        try {
            const response = await axiosInstance.get("/api/comic/get-comiccards-data/")
            const data = response.data
            const loaded = true
            return {data, loaded}
        }
        catch (error) {
            ElMessage({
                message: `请求漫画卡片数据错误, 错误信息: ${error}`,
                type: "error",
            })
            return {data: null, loaded: false}
        }
    },
    // 请求漫画详细信息
    getComicDetail: async (id)=> {
        let loaded
        try {
            const response= await axiosInstance.get(
                "/api/comic/get-comic-detail/",
                {params: {id: id}}
            )
            const data = response.data
            loaded = true
            return {data, loaded}
        }
        catch (error) {
            ElMessage({
                message: `请求漫画信息失败, 错误信息: ${error}`,
                type: "error"
            })
            loaded = false

            return {loaded}
        }
    },
    // 请求漫画内容图片数据
    getComicContentImagesData: async (id)=> {
        let loaded
        try {
            const response= await axiosInstance.get(
                "/api/comic/get-comic-content-images-data/",
                {
                    params: {id: id}
                }
            )
            const data = response.data
            loaded = true
            return {data, loaded}
        }
        catch (error) {
            ElMessage({
                message: `请求漫画内容图片数据失败, 错误信息: ${error}`,
                type: "error"
            })
            loaded = false
            return {loaded}
        }
    },
    postAddComic: async (data) => {
        let success
        try {
            const response = await axiosInstance.post(
                "/api/comic/post-add-comic/",
                data,
                {
                    headers: {"Content-Type": "multipart/form-data"}
                }
            )
            ElMessage({
                message: "漫画上传成功",
                type: "success"
            })
            success = true

            return {response, success}
        }
        catch (error) {
            ElMessage({
                message: `漫画上传失败, 错误信息: ${error}`,
                type: "error"
            })
            success = false

            return {success}
        }
    },
    // 上传epub漫画文件
    postEpubComicFile: async (data) => {
      let success
      try {
          const response = await axiosInstance.post(
              "/api/comic/post-epub-add-comic/",
              data,
              {
                  headers: {"Content-Type": "multipart/form-data"}
              }
          )
          ElMessage({
              message: "漫画上传成功",
              type: "success"
          })
          success = true

          return {success}
      }
      catch (error) {
          ElMessage({
              message: `漫画上传失败, 错误信息: ${error}`,
              type: "error"
          })
          success = false

          return {success}
      }
    },
    deleteComic: async (comicId) => {
        let success
        try {
            const response = await axiosInstance.delete(
                "/api/comic/delete-comic/",
                {
                    params: {id: comicId}
                }
            )
            ElMessage({
                message: "删除漫画成功",
                type: "success"
            })
            success = true
            return {success}
        }
        catch (error) {
            ElMessage({
                message: "删除漫画失败, 请稍后再试",
                type: "error"
            })
            success = false
            return {success}
        }
    },
    patchComicReadFrequency: async (comicId) => {
        let success
        try {
            await axiosInstance.patch(
                "/api/comic/patch-update-comic-read-frequency/",
                {id: comicId}
            )
            success = true

            return {success}
        }
        catch (error) {
            ElMessage({
                message: `更新漫画阅读次数失败, 错误信息: ${error}`,
                type: "error"
            })
            success = false

            return {success}
        }
    }
}

export default comicAPI;
