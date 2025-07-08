<script setup>
import {inject, ref} from "vue";
  import {DocumentDelete, Star} from "@element-plus/icons-vue";
  import {useRouter} from "vue-router";
  import PvoDialogDelComic from "./ComicDialog/pvoDialogDelComic.vue"

  // 路由
  const router = useRouter()

  // 组件变量
  const comic = defineProps({
    id: {
      type: Number,
      required: true,
    },
    comic_cover_src: {
      type: String,
      required: true
    },
    comic_name: {
      type: String,
      required: true
    },
    comic_tags: {
      type: Array[String],
    },
    is_star: {
      type: Boolean,
      default: false
    }
  })
  const is_star =  ref(comic.is_star)

  // 组件函数
  const changeStar = () => {
    is_star.value = !is_star.value
  }
  // 页面跳转
  const jumpToComicPage = () => {
    router.push({path: `/comic/${comic.id}`})
  }

  // 漫画删除对话框
  const delComicDialog = ref(null)
  const openDelComicDialogVisible = () => {
    delComicDialog.value.open()
  }
</script>

<template>
  <PvoDialogDelComic ref="delComicDialog" :comic-id="id" :comic-name="comic_name"/>
  <article class="comic-card">
    <div class="comic-cover">
      <img :src="comic.comic_cover_src" :alt="comic.comic_name" :title="comic.comic_name" @click="jumpToComicPage">
      <div class="star" @click="changeStar">
        <el-icon :color="is_star ? 'rgb(255, 122, 0)' : '#000'" ><Star /></el-icon>
      </div>
      <div class="del-comic" @click="openDelComicDialogVisible">
        <el-icon><document-delete/></el-icon>
      </div>
    </div>
    <div class="comic-card-title">
      <p>{{comic.comic_name}}</p>
    </div>
    <div class="comic-tags-container">
      <ul class="comic-tags">
        <li v-for="tag in comic.comic_tags">{{tag}}</li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
  .comic-card {
    position: relative;
    width: 240px;
    height: 320px;
    margin-bottom: 40px;
  }
  .comic-cover {
    position: relative;
    width: 100%;
    height: 290px;
  }
  .comic-cover img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    object-fit: cover;
    cursor: pointer;
    transition: box-shadow, transform  0.3s ease;
   }
  .comic-cover img:hover {
    transform: translateY(-4px);
    }
  .star {
    width: 26px;
    height: 26px;
    position: absolute;
    bottom: 5px;
    right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    background-color: #c8c8c8cc;
    z-index: 50;
    transition: all 0.3s ease;
    cursor: pointer;
    }
  .del-comic {
    position: absolute;
    top: 5px;
    right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 26px;
    height: 26px;
    background-color: #c8c8c8cc;
    border-radius: 5px;
    cursor: pointer;
    z-index: 50;
    transition: all 0.3s ease;
  }
  .comic-card-title p {
    margin: 0;
    padding-top: 5px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;
    color: #777777;
    font-size: 16px;
  }
  .comic-tags-container {
    width: 100%;
  }
  .comic-tags {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 3px;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 5px 0;
    list-style-type: none;
    overflow: auto;
    white-space: nowrap;
  }
  .comic-tags::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    margin-top: 10px;
  }
  .comic-tags::-webkit-scrollbar-thumb {
    border-radius: 1rem;
    background-color: rgba(0, 0 ,0 , .15);
    cursor: pointer;
  }
  .comic-tags::-webkit-scrollbar-thumb:hover {
    background-color: #888;
  }
  .comic-tags::-webkit-scrollbar-track {
    border-radius: 0;
    background-color: transparent;
  }
  .comic-tags li {
    border-radius: 2rem;
    padding: 0 5px;
    font-size: 12px;
    background-color: #666;
    color: #fff;
    max-width: 80px;
    cursor: pointer;
  }

</style>