<script setup>
  import LGMComicReaderToolBar from "../../../components/ComicReaderToolBar/LGMComicReaderToolBar.vue";
  import {computed, inject, onMounted, onUnmounted, provide, ref, watch} from "vue";
  import comicAPI from "../../../api/comic/comic.js";
  import {useRoute} from "vue-router";
  import * as timers from "node:timers";

  // 组件注入的函数
  const toggleSideMenu = inject("toggleSideMenu")

  // 路由
  const route = useRoute()

  // 组件变量
  const comicId = route.params.id
  const comicImgsData = ref()
  const currentPage = ref(1)
  const comicPages = ref(0)
  const loaded = ref(false)

  const isAutoPlay = ref(false)
  const autoPlayInterval = ref(3000)
  let timer

  // 组件计算属性

  // 组件函数
  // 请求漫画图片数据
  async function getComicContentImagesData() {
    const res = await comicAPI.getComicContentImagesData(comicId)
    comicImgsData.value = res.data.images_data
    comicPages.value = res.data.pages
    loaded.value = res.loaded
  }
  // 鼠标滑动事件
  function scrollPage (event) {
    event.deltaY > 0 ? currentPage.value += 1 : currentPage.value -= 1
  }
  // 自动播放控制
  function changeIsAutoPlay (event) {
    isAutoPlay.value = event
  }
  function changeCurrentPage (event) {
    currentPage.value = event
  }

  // 监听数据
  watch(currentPage, () => {
    currentPage.value = currentPage.value > comicPages.value ? comicPages.value : currentPage.value
    currentPage.value = currentPage.value < 1 ? 1 : currentPage.value
  })
  // 自动播放
  watch(isAutoPlay, (value) => {
    if (value) {
      timer = setInterval(() => {
        currentPage.value += 1
      }, autoPlayInterval.value)
    }
    else clearInterval(timer)
  })

  // 底部工具栏
  const toolbar = ref(null)
  function changeToolbarVisible() {
    toolbar.value.changeIsShow()
  }

  // 组件挂载钩子函数
  onMounted(() => {
    toggleSideMenu(false)
    getComicContentImagesData()
  })
  onUnmounted(() => {
    toggleSideMenu(true)
  })

  // 组件提供函数，变量
  provide("comicPages", comicPages)
  provide("comicCurrentPage", currentPage)
</script>

<template>
  <section class="px-8 py-0" v-if="loaded">
    <div class="flex justify-center items-center" @click="changeToolbarVisible" @wheel.prevent="scrollPage">
      <img :src="comicImgsData[currentPage-1]" :alt="`漫画第${currentPage}页`" class="w-auto h-[calc(100vh-100px)] object-fill"/>
    </div>
    <LGMComicReaderToolBar ref="toolbar"
                           @pre-page="currentPage -= 1"
                           @auto-play="changeIsAutoPlay"
                           @next-page="currentPage += 1"
                           @slider-value-change="changeCurrentPage"
    />
  </section>
</template>

<style scoped>

</style>