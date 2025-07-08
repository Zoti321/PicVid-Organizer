<script setup>
import {computed, inject, onMounted, ref, watch} from "vue"
  import {Plus} from "@element-plus/icons-vue"
  import categoryTagsAPI from "../api/comic/categoryTags.js";
  import {useR18ModeStore} from "../stores/r18ModeStore.js";
  import _ from "lodash"

  // app 全局状态
  const r18Mode = useR18ModeStore().isR18

  // 注入的数据方法
  const comicId = inject("comicId")
  const categoryTags = inject("categoryTags")
  const getComicDetail = inject("getComicDetail")
  // 组件变量
  // props参数
  const props = defineProps({
    type: {
      type: String
    }
  })

  // 组件状态数据
  const selectedTags = ref([])
  const isExpand = ref(false)

  // 组件计算属性
  const filteredData = computed(() => {
    let data = categoryTags.value[props.type].data
    if (props.type === "tags") {
      if (!r18Mode) {
        return data.filter(item => !item.is_r18).map(item => item.tag_name)
      }
      else return data.map(item => item.tag_name)
    }
    return data
  })

  // 组件函数方法
  // 提交分类标签数据
  async function postAddTag() {
    const data = {
      comic_id: comicId,
      type: props.type,
      tags: selectedTags.value
    }

    await categoryTagsAPI.postAddCategoryTagToComic(data)
    selectedTags.value = []
    await getComicDetail()
  }

  // 改变展开状态
  const changeIsExpand = () => {
    isExpand.value = !isExpand.value
  }

  // 监听展开状态
  watch(isExpand, async (newStatus, oldStatus) => {
    if (newStatus === false && oldStatus === true && selectedTags.value.length > 0) {
      await postAddTag()
    }
  })

  // 组件挂载钩子函数
  onMounted(() => {

  })
</script>

<template>
  <el-select v-show="isExpand" v-model="selectedTags" placeholder="" multiple collapse-tags collapse-tags-tooltip class="w-[125px]">
    <el-option v-for="data in filteredData" :label="data" :value="data"/>
  </el-select>
  <div class="flex justify-between items-center gap-[5px] box-border min-h-8 m-0 px-[10px] py-[5px] border-[#999] border-solid border rounded-[5px]
  bg-transparent text-[#999] text-sm cursor-pointer transition-all duration-300 ease-linear"
       @click="changeIsExpand"
  >
    <el-icon class="hover:text-[#999]"><plus/></el-icon>
  </div>
</template>

<style scoped>

</style>