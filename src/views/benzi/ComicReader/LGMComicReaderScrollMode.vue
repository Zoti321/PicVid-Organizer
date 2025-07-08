<script setup>
  import {ref, onMounted, onUnmounted, inject} from 'vue'
  import {useRoute} from "vue-router";
  import axios from "axios";
  import LGMComicReaderToolBarSide from "../../../components/ComicReaderToolBar/LGMComicReaderToolBarSide.vue";
  import comicAPI from "../../../api/comic/comic.js"

  // 组件注入函数方法
  const toggleSideMenu = inject('toggleSideMenu')

  // 侧边栏组件
  const asideToolBar = ref(null)
  function openAsideToolBar () {
    asideToolBar.value.changeVisble()
  }

  // 通过路由获取漫画id
  const route = useRoute()
  const id = route.params.id

  // 组件变量
  const comicContentImagesData = ref()
  const currentPage = ref(1)
  const imgRatio = ref(100)
  const loaded = ref(false)

  // 请求数据
  async function getComicContentImagesData () {
    const res = await comicAPI.getComicContentImagesData(id)
    comicContentImagesData.value = res.data
    loaded.value = res.loaded
  }

  // 组件函数方法
  // 跳转到对应的漫画页
  const handleCurrentPageChange = (newPage) => {
    currentPage.value = newPage
    const targetImage = document.getElementById(`comic-page-${newPage - 1}`)
    if (targetImage) {
      targetImage.scrollIntoView({behavior: 'smooth',  block: 'start'})
    }
  }

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // 根据视口中心调整当前页面
  function handleScroll () {
    let closetImageIndex = 0
    let minDistance = Infinity
    if (comicContentImagesData.value) {
      for (let i = 0; i < comicContentImagesData.value.pages; i++) {
        const imgElement = document.getElementById(`comic-page-${i}`)
        if (imgElement) {
          const rect = imgElement.getBoundingClientRect()
          const imgCenterY = rect.top + rect.height / 2
          const viewportCenterY = window.innerHeight / 2
          const distance = Math.abs(imgCenterY - viewportCenterY)

          if (distance < minDistance) {
            minDistance = distance
            closetImageIndex = i
          }
        }
      }
    }
    currentPage.value = closetImageIndex + 1
  }

  // 组件挂载钩子函数
  onMounted( () => {
    getComicContentImagesData()
    toggleSideMenu(false)
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    toggleSideMenu(true)
  })

</script>

<template>
  <section class="relative" v-if="loaded">
    <figure id="comic" @click="openAsideToolBar"
            class="relative max-w-[1000px] my-0 mx-auto p-1 bg-white
            rounded-xl shadow-md transition-all ease-linear duration-300"
    >
      <figcaption
          class="relative text-2xl font-bold text-[#333] text-center mb-8 py-4 px-0 border-b border-solid border-[#eee]
          after:content-[''] after:absolute after:-bottom-px after:left-1/2 after:-translate-x-1/2 after:w-[100px] after:h-[3px]
          after:bg-gradient-to-t after:from-[#ff7a00] after:to-[#ff9e00] after:rounded-[3px]"
      >
        {{comicContentImagesData.name}}
      </figcaption>
      <div class="flex flex-col items-center gap-1">
        <img v-for="(img, index) in comicContentImagesData.images_data"
             :src="img" :alt="index"
             :key="index" :id="`comic-page-${index}`"
             class="max-w-full h-auto object-contain transition-transform duration-300 ease-linear"
        >
      </div>
    </figure>
    <LGMComicReaderToolBarSide ref="asideToolBar"
                               :loaded="loaded"
                               :comic-id="id"
                               :pages="comicContentImagesData.pages"
                               :current-page="currentPage"
                               @scroll-to-top="scrollToTop" @current-page-change="handleCurrentPageChange"
    />
  </section>
</template>

<style scoped>
.comic-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  position: relative;
}
.comic-title::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, #ff7a00, #ff9e00);
  border-radius: 3px;
}
.comic-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}
.comic-content img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}


/* 添加响应式设计 */
@media (max-width: 768px) {
  .comic {
    padding: 15px;
    border-radius: 8px;
  }
  .comic-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  .comic-content {
    gap: 15px;
  }
  .comic-reader-toolbar {
    right: 20px;
  }
}

/* 添加加载动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.comic-content img {
  animation: fadeIn 0.5s ease-out;
  animation-fill-mode: both;
}

.comic-content img:nth-child(1) { animation-delay: 0.1s; }
.comic-content img:nth-child(2) { animation-delay: 0.2s; }
.comic-content img:nth-child(3) { animation-delay: 0.3s; }
.comic-content img:nth-child(4) { animation-delay: 0.4s; }
.comic-content img:nth-child(5) { animation-delay: 0.5s; }
.comic-content img:nth-child(n+6) { animation-delay: 0.6s; }

</style>