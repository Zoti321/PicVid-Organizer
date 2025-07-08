<script setup>
import {onMounted, ref, watch} from "vue";
  import {useRouter} from "vue-router";
  import {gsap} from "gsap";

  // 从父组件接受的数据
  const props = defineProps({
    pages: {type: Number, default: 0},
    loaded:  {type: Boolean, default: false},
    comicId: {type: String, default: null},
    currentPage: {type: Number, default: 1},
  })

  // 组件变量
  const router = useRouter();
  const selectCurrentPage = ref(1);
  const isVisible = ref(true)

  watch(() => props.currentPage, (value) => {
    selectCurrentPage.value = value
  })


// 组件事件
  const emit = defineEmits(['scrollToTop', 'currentPageChange'])
  function send(type) {
    if (type === 'scrollToTop') {
      emit('scrollToTop')
    }
    if (type === 'currentPageChange') {
      emit('currentPageChange', selectCurrentPage.value)
    }
  }

  // 组件方法
  function changeVisble() {
    isVisible.value = !isVisible.value
  }

  function pushToComicPage() {
    router.push({path: `/comic/${props.comicId}`})
  }

  function imgRatioChange() {

  }

  // 控制图片比例
  const imgRatio = ref(100)
  const isImgRatioInputFocus = ref(false)
  function changeImgRatioInputFocus(value) {
    isImgRatioInputFocus.value = value
  }
  function onWheel(event) {
    if (isImgRatioInputFocus.value) {
      if (event.deltaY < 0) {
        imgRatio.value += 5
      }
      if (event.deltaY > 0) {imgRatio.value -= 5}
    }
  }

  // 组件挂载动画
  const fixedEl = ref(null)
  onMounted(() => {
    gsap.set(fixedEl.value, {opacity: 1, x: 0})
  })
  function beforeEnter(el) {
    gsap.set(el, {opacity: 0, x: 100})
  }
  function enter(el, done) {
    gsap.to(el, {opacity: 1, x: 0, duration: 0.3, onComplete: done})
  }
  function leave(el, done) {
    gsap.to(el, {opacity: 0, x: 100, duration: 0.3, onComplete: done})
  }

  // 组件暴露
  defineExpose({
    changeVisble,
  })
</script>

<template>
  <transition name="sidebar-slideInRight"
              @before-enter="beforeEnter"
              @enter="enter"
              @leave="leave"
  >
    <aside v-show="isVisible" ref="fixedEl" class="fixed top-2/4 -translate-y-2/4 right-14 flex flex-col justify-around items-center gap-2 p-4 bg-white rounded-lg shadow-lg">
      <el-button type="primary">全屏阅读</el-button>
      <el-button type="primary" @click="pushToComicPage">漫画简介</el-button>
      <el-button type="primary">相关漫画</el-button>
      <el-select v-model="selectCurrentPage" @change="send('currentPageChange')" style="width: 100px">
        <el-option v-for="n in pages" v-if="loaded"
                   :key="`page-${n}`"
                   :label="`${n}/${pages}`"
                   :value="n"
        />
      </el-select>
      <el-input-number v-model="imgRatio" :min="10" :max="120" :step="5" step-strictly
                       style="width: 120px"
                       controls-position="right"
                       @change="imgRatioChange"
                       @focus="changeImgRatioInputFocus(true)"
                       @blur="changeImgRatioInputFocus(false)"
                       @wheel.prevent="onWheel"
      >
        <template #suffix>
          <span>%</span>
        </template>
      </el-input-number>
      <el-button type="primary" @click="send('scrollToTop')">回到顶部</el-button>
    </aside>
  </transition>
</template>

<style scoped>
  aside .el-button {
    margin: 0;
  }
</style>