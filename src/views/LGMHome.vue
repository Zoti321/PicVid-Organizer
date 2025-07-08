<script setup>
import {onMounted, ref} from "vue";
  import axios from "axios";

  // 请求数据
  const recommendComics = ref()
  const getRecommendComicsData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/comic/get-recommend-comics/")
      recommendComics.value = response.data
      console.log(recommendComics.value)
    }
    catch (err) {
      alert("请求数据失败")
    }
  }

  onMounted(() => {
    // getRecommendComicsData()
  })
</script>

<template>
 <section>
   <h1>轮播图</h1>
   <el-carousel :interval="4000" type="card" height="420px" indicator-position="outside">
     <el-carousel-item v-for="data in recommendComics" :key="data.id">
       <img class="carousel-comic-img" :src="data.cover_image_file_url" alt="今日漫画作品推荐" :title="data.name">
     </el-carousel-item>
   </el-carousel>
 </section>
</template>

<style scoped>
  .carousel-comic-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .el-carousel-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .el-carousel-item h3 {
    position: absolute;
    top: 0;
    left: 50%;
  }
</style>