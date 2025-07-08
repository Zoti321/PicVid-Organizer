<script setup>
  import {useRoute, useRouter} from "vue-router";
  import {computed, onMounted, provide, ref} from "vue";
  import PvoComicTagAdder from "../../components/pvoComicTagAdder.vue";
  import comicAPI from "../../api/comic/comic.js";
  import categoryTagsAPI from "../../api/comic/categoryTags.js";

  const route = useRoute()
  const router = useRouter()

  // 组件数据
  const comicId = route.params.id
  const comicDetail = ref()
  const loaded = ref(false)
  const selectedTag = ref()
  const categoryTags = ref()

  // 组件计算属性
  const selectedTagName = computed(() => {
    if (selectedTag.value != null) {
      return selectedTag.value.split('-')[1]
    }
  })
  const selectedTagType = computed(() => {
    if (selectedTag.value != null) {
      return selectedTag.value.split('-')[0]
    }
  })
  // 分类标签操作按钮使用状态
  const useTagOperation = computed(() => {
    return selectedTag != null
  })

  // 组件函数
  const selectTag = (tag) => {
    if (selectedTag.value === tag) {
      selectedTag.value = null
    }
    else {
      selectedTag.value = tag
    }
  }
  // 请求分类标签数据
  async function getCategoryTagsList () {
    const res = await categoryTagsAPI.getAllCategoryTags()
    if (res.loaded) {
      categoryTags.value = res.data
    }
  }
  // 移除分类标签
  async function removeCategoryTag () {
    const data = {
      type: selectedTagType.value,
      comic_id: comicId,
      tag_name: selectedTagName.value
    }

    await categoryTagsAPI.removeCategoryTag(data)
    selectedTag.value = null
    await getComicDetail()
  }
  // 获取漫画信息
  const getComicDetail = async () => {
    const res = await comicAPI.getComicDetail(comicId)
    comicDetail.value = res.data
    loaded.value = res.loaded
  }
  // 更新漫画阅读次数
  const patchComicReadFrequency = async () => {
    await comicAPI.patchComicReadFrequency(comicId)
  }
  // 跳转到阅读页面
  const readComic = () => {
    router.push(`/comic-reader/${comicId}`)
    patchComicReadFrequency()
  }
  const readComicScrollMode = () => {
    router.push(`/comic-reader-scroll/${comicId}`)
    patchComicReadFrequency()
  }

  // 组件挂载钩子函数
  onMounted(() => {
    getComicDetail()
    getCategoryTagsList()
  })

  // 组件提供函数
  provide("comicId", comicId)
  provide("categoryTags", categoryTags)
  provide("getComicDetail", getComicDetail)
</script>

<template>
  <section v-if="loaded">
    <div class="comic-page-title">
      <h1>{{comicDetail.name}}</h1>
    </div>
    <div class="comic-page-main">
      <div class="comic-content-preview">
        <div class="comic-content-preview-cover">
          <img :src="comicDetail.cover_image_file_url" alt="漫画封面" @click="readComic">
        </div>
      </div>
      <div class="comic-information">
        <div class="comic-id">
          <span>
            漫画id:
          </span>
          lgm{{comicId}}
        </div>
        <div class="">
          <span>作品: </span>
          <div class="tag-container">
            <div class="lgm-tag" :class="{'selected-lgm-tag': selectedTagName === series_i}"
                 v-for="series_i in comicDetail.series" :key="`作品-${series_i}`"
                 @click="selectTag(`作品-${series_i}`)"
                 >
              {{series_i}}
            </div>
            <PvoComicTagAdder type="series"/>
          </div>
        </div>
        <div class="comic-characters">
          <span>登场人物: </span>
          <div class="tag-container">
            <div class="lgm-tag" :class="{'selected-lgm-tag': selectedTagName === character}"
                 v-for="character in comicDetail.characters" :key="`登场人物-${character}`"
                 @click="selectTag(`登场人物-${character}`)"
            >
              {{character}}
            </div>
            <PvoComicTagAdder type="characters"/>
          </div>
        </div>
        <div class="comic-tags">
          <span>标签: </span>
          <div class="tag-container">
            <div class="lgm-tag" :class="{'selected-lgm-tag': selectedTagName === tag}"
                 v-for="tag in comicDetail.tags" :key="`标签-${tag}`"
                 @click="selectTag(`标签-${tag}`)"
            >
              {{tag}}
            </div>
            <PvoComicTagAdder type="tags"/>
          </div>
        </div>
        <div class="comic-author">
          <span>作者: </span>
          <div class="tag-container">
            <div class="lgm-tag" :class="{'selected-lgm-tag': selectedTagName === author}"
                 v-for="author in comicDetail.authors" :key="`作者-${author}`"
                 @click="selectTag(`作者-${author}`)"
            >
              {{author}}
            </div>
            <PvoComicTagAdder type="authors"/>
          </div>
        </div>
        <div class="tag-operation" :class="{'have-selected-tag': selectedTag != null}">
          <button type="button" :disabled="!useTagOperation">搜索分类标签</button>
          <button type="button" :disabled="!useTagOperation" @click="selectedTag=null">取消选取</button>
          <button type="button" :disabled="!useTagOperation" @click="removeCategoryTag">删除Tag</button>
        </div>
        <div class="comic-narrate">
          <span>叙述: </span>
          {{comicDetail.narrate}}
        </div>
        <div class="comic-pages">
          <span>页数: </span>
          {{comicDetail.pages}}
        </div>
        <div class="comic-add-date">
          <span>添加日期: </span>
          {{comicDetail.add_date}}
        </div>
        <div class="comic-read-frequency">
          <span>阅读次数: </span>
          {{comicDetail.read_frequency}}
        </div>
        <div class="comic-operations">
          <el-button type="primary" @click="readComic">开始阅读</el-button>
          <el-button type="primary" @click="readComicScrollMode">条漫阅读</el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  background-color: #ffffff;
  color: #555;
  font-size: 14px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.comic-page-title {
  width: 100%;
  margin-bottom: 30px;
  position: relative;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.comic-page-title h1 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.comic-page-main {
  display: flex;
  gap: 50px;
}

.comic-content-preview {
  flex: 0 0 450px;
}

.comic-content-preview-cover {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.comic-content-preview-cover img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  cursor: pointer;
  transition: transform 0.5s ease;
}

.comic-information {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px;
}

.comic-information > div {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.comic-information > div:last-child {
  border-bottom: none;
}

.comic-information span {
  color: #777;
  min-width: 40px;
}

.comic-id {
  font-size: 16px;
  color: #777;
}

.comic-id span {
  margin-right: 10px;
}

.comic-characters, .comic-tags, .comic-author {
  display: flex;
  gap: 8px;
}

.tag-container {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.lgm-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  min-height: 32px;
  margin: 0;
  padding: 5px 10px;
  border: #999 solid 1px;
  border-radius: 5px;
  background-color: transparent;
  color: #999;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lgm-tag:not(.selected-lgm-tag):hover {
  border-color: #ff7a00;
  color: #ff7a00;
}

.selected-lgm-tag {
  background-color: #333;
  color: #ffffff;
}

.tag-operation {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
}

.tag-operation > button {
  padding: 5px 10px;
  background-color: #bfbfbf;
  color: #ffffff;
  border: none;
  border-radius: 3px;
  line-height: 1.5;
  font-size: 14px;
}

.have-selected-tag > button {
  background-color: #808080;
  cursor: pointer;
}

.have-selected-tag > button:hover {
  background-color: #999;
}

.comic-narrate {
  line-height: 1.6;
}

.comic-operations {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  padding-top: 20px !important;
  border-top: 1px solid #eee !important;
  border-bottom: none !important;
}

.comic-operations .el-button {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.comic-operations .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.comic-operations .el-button:first-child {
  background: linear-gradient(135deg, #ff7a00, #ff9e00);
  border-color: transparent;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .comic-page-main {
    flex-direction: column;
    gap: 30px;
  }

  .comic-content-preview {
    flex: none;
    max-width: 350px;
    margin: 0 auto;
  }
}

@media (max-width: 576px) {
  section {
    padding: 20px 15px;
  }

  .comic-page-title h1 {
    font-size: 24px;
  }

  .comic-information > div {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .comic-information span {
    min-width: auto;
  }

  .comic-operations {
    flex-wrap: wrap;
  }
}

/* 添加动画效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

section {
  animation: fadeIn 0.5s ease-out;
}
</style>