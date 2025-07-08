<script setup>
import {computed, inject, onMounted, ref} from "vue";
  import categoryTagsAPI from "../../api/comic/categoryTags.js";
  import comicAPI from "../../api/comic/comic.js";
  import _ from "lodash"

  // 组件注入
  const getComicCards = inject("getComicCardsData")

  // 文件输入框
  const fileInput = ref()

  // 组件数据变量
  const visible = ref(false)
  const epubFile = ref()
  const selectItemsData = ref()
  const loaded = ref(false)
  const formComicInformation = ref({
    is_r18: false,
    series: null,
    characters: null,
    tags: null,
    authors: null,
  })

  // 组件计算属性
  const filteredTagsData = computed(() => {
    if (loaded.value) {
      if (!formComicInformation.value.is_r18) {
        return _.filter(selectItemsData.value.tags.data, data => !data.is_r18)
      }
      else return selectItemsData.value.tags.data
    }
  })
  // 组件函数
  function open () {
    visible.value = true
  }
  function close () {
    visible.value = false
  }
  function openFileWindow () {
    fileInput.value.click()
  }
  function changeEpubFile(event) {
    epubFile.value = event.target.files[0]
  }
  // 清空表单数据
  function clearFormData () {
    epubFile.value = null
    formComicInformation.value.series = null
    formComicInformation.value.characters = null
    formComicInformation.value.tags = null
    formComicInformation.value.authors = null
  }
  // 获取分类标签数据
  async function getCategoryTags () {
    const res = await categoryTagsAPI.getAllCategoryTags()
    if (res.loaded) {
      selectItemsData.value = res.data
      loaded.value = res.loaded
    }
  }
  // 提交表单数据
  async function postSubmitFormData () {
    if (epubFile.value) {
      const formData = {
        epub_file: epubFile.value,
        series: formComicInformation.value.series,
        characters: formComicInformation.value.characters,
        tags: formComicInformation.value.tags,
        authors: formComicInformation.value.authors,
      }
      await comicAPI.postEpubComicFile(formData)
      await getComicCards()
      clearFormData()
      close()
    }

  }
  // 组件挂载
  onMounted(() => {
    getCategoryTags()
  })

  // 组件暴露
  defineExpose({
    open
  })
</script>

<template>
  <teleport to="body">
    <el-dialog v-model="visible" center class="px-8 py-4">
      <template #header>
        <h2>添加从Kmoe下载的epub漫画文件</h2>
      </template>
      <section class="flex justify-start items-center">
        <form class="flex flex-col items-center gap-8">
          <div class="w-full flex justify-start items-center gap-16">
            <label for="epubFile" class="form-label">epub文件: </label>
            <div class="flex justify-start items-center gap-2">
              <el-button type="primary" @click="openFileWindow">选择文件</el-button>
              <span>{{epubFile ? epubFile.name : "未选择任何文件"}}</span>
            </div>
            <input id="epubFile" type="file" accept="application/epub+zip" @change="changeEpubFile" ref="fileInput" class="w-0 h-0">
          </div>
          <div class="w-full flex justify-start items-center gap-16">
            <label class="form-label">分类标签: </label>
            <div class="grid grid-cols-2 gap-x-8 gap-y-4">
              <el-select :placeholder="selectItemsData.series.type"
                         v-model="formComicInformation.series"
                         multiple collapse-tags collapse-tags-tooltip filterable
                         class="w-64"
              >
                <el-option v-for="option in selectItemsData.series.data" :value="option" :label="option"/>
              </el-select>
              <el-select :placeholder="selectItemsData.characters.type"
                         v-model="formComicInformation.characters"
                         multiple collapse-tags collapse-tags-tooltip filterable
                         class="w-64"
              >
                <el-option v-for="option in selectItemsData.characters.data" :value="option" :label="option"/>
              </el-select>
              <el-select :placeholder="selectItemsData.tags.type"
                         v-model="formComicInformation.tags"
                         multiple collapse-tags collapse-tags-tooltip filterable
                         class="w-64"
              >
                <el-option v-for="option in filteredTagsData" :value="option.tag_name" :label="option.tag_name"/>
              </el-select>
              <el-select :placeholder="selectItemsData.authors.type"
                         v-model="formComicInformation.authors"
                         multiple collapse-tags collapse-tags-tooltip filterable
                         class="w-64"
              >
                <el-option v-for="option in selectItemsData.authors.data" :value="option" :label="option"/>
              </el-select>
            </div>
          </div>
          <div class="w-full flex justify-start items-center gap-16">
            <label class="form-label">R18</label>
            <el-switch v-model="formComicInformation.is_r18"/>
          </div>
        </form>
      </section>
      <template #footer>
        <div class="flex justify-between items-center">
          <el-button @click="clearFormData">重置</el-button>
          <div class="flex justify-between items-center">
            <el-button type="success" plain @click="postSubmitFormData">确认</el-button>
            <el-button type="info" @click="close">取消</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </teleport>
</template>

<style scoped>

</style>