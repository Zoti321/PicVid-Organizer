<script setup>
import {inject, onMounted, ref, watch} from "vue";
  import {RiMemoriesLine, RiPauseLargeLine, RiPlayLargeLine} from '@remixicon/vue'
  import {ArrowLeft, ArrowRight, FullScreen, ZoomIn, ZoomOut} from '@element-plus/icons-vue'
  import gsap from 'gsap';

  // 组件事件
  const emit = defineEmits([
      "prePage",
      "nextPage",
      "autoPlay",
      "zoomIn",
      "zoomOut",
      "fullScreen",
      "sliderValueChange"
  ])
  // 组件注入的函数，变量
  const comicPages = inject("comicPages")
  const comicCurrentpage = inject("comicCurrentPage")

  // 组件变量
  const isShow = ref(true)
  const currentPage = ref(1)
  const imageRatio = ref(null)
  const isAutoPlay = ref(false)

  // 函数方法
  function changeIsShow() {
    isShow.value = !isShow.value
  }
  function prePage() {
    emit("prePage")
  }
  function changeIsAutoPlay() {
    isAutoPlay.value = !isAutoPlay.value
    emit("autoPlay", isAutoPlay.value)
  }
  function nextPage() {
    emit("nextPage")
  }
  function setAutoPlayInterval() {

  }
  function zoomIn() {

  }
  function zoomOut() {

  }
  function fullScreen() {

  }
  function slideValueChange () {
    emit("sliderValueChange", currentPage.value)
  }

  // 变量监听
  watch(comicCurrentpage, (value) => {
    currentPage.value = value
  })

  // 组件动画
  const fixedEl = ref(null)
  onMounted(() => {
    gsap.set(fixedEl.value, { opacity: 1, y: 0 })
  })
  function beforeEnter(el) {
    gsap.set(el, { opacity: 0, y: 100 })
  }
  function enter(el, done) {
    gsap.to(el, { opacity: 1, y: 0, duration: 0.3, onComplete: done })
  }
  function leave(el, done) {
    gsap.to(el, { opacity: 0, y: 100, duration: 0.3, onComplete: done })
  }

  // 暴露方法
  defineExpose({
    changeIsShow
  })
</script>

<template>
  <transition name="comic-reader-toolbar-pagemode"
              @before-enter="beforeEnter"
              @enter="enter"
              @leave="leave">
    <div v-show="isShow"
         ref="fixedEl"
         class="fixed bottom-5 left-1/2 -translate-x-1/2 w-[750px] flex flex-col justify-evenly items-center
         px-4 py-3 rounded-lg bg-white shadow-md"
    >
      <el-slider v-model="currentPage" :min="1" :max="comicPages"
                 @input="slideValueChange"
      />
      <div class="relative w-full flex justify-between items-center gap-8">
        <div class="transition-all duration-500 ease-linear">{{comicCurrentpage}}/{{comicPages}}</div>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 flex justify-center items-center gap-[5px]">
          <el-button class="toolbar-buttons" @click="prePage"><el-icon size="18px"><ArrowLeft/></el-icon></el-button>
          <el-button class="toolbar-buttons" @click="changeIsAutoPlay">
            <el-icon size="18px" v-if="!isAutoPlay"><RiPlayLargeLine/></el-icon>
            <el-icon size="18px" v-else><ri-pause-large-line/></el-icon>
          </el-button>
          <el-button class="toolbar-buttons" @click="nextPage"><el-icon size="18px"><arrow-right/></el-icon></el-button>
        </div>
        <div class="flex justify-center items-center gap-[5px]">
          <el-button class="toolbar-buttons" @click="setAutoPlayInterval"><el-icon size="18px"><ri-memories-line/></el-icon></el-button>
          <el-button class="toolbar-buttons" @click="zoomIn"><el-icon size="18px"><ZoomIn/></el-icon></el-button>
          <el-button class="toolbar-buttons" @click="zoomOut"><el-icon size="18px"><ZoomOut/></el-icon></el-button>
          <el-button class="toolbar-buttons" @click="fullScreen"><el-icon size="18px"><FullScreen/></el-icon></el-button>
        </div>
      </div>
    </div
    >
  </transition>
</template>

<style scoped>
  @keyframes fadeInUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes fadeOutDown {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(100%);
      opacity: 0;
    }
  }
</style>