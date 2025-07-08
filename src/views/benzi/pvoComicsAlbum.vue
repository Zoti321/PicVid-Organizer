<script setup>
  import {FolderAdd, CollectionTag, Sort} from "@element-plus/icons-vue";
  import PvoComicCard from "../../components/pvoComicCard.vue";
  import PvoDialogUploadComicFolder from "../../components/ComicDialog/pvoDialogUploadComicFolder.vue";
  import {computed, onMounted, provide, ref, watch} from "vue";
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
  import {faFileZipper} from "@fortawesome/free-regular-svg-icons";
  import PvoDialogAddComicTag from "../../components/ComicDialog/pvoDialogAddComicTag.vue";
  import {RiCircleFill, RiFileImageLine, RiFilePdfLine} from "@remixicon/vue";
  import comicAPI from "../../api/comic/comic.js"
  import _ from 'lodash'
  import {useR18ModeStore} from "../../stores/r18ModeStore.js";
  import categoryTagsAPI from "../../api/comic/categoryTags.js";
  import PvoDialogEpub from "../../components/ComicDialog/pvoDialogEpub.vue";

  // 控制上传漫画对话框显示
  const lgmDialogUploadComicFolder = ref(null)
  function callChildFunc() {
    lgmDialogUploadComicFolder.value.changeDialogVisible()
  }
  // 控制添加Tag对话框显示
  const dialogAddTag = ref(null)
  function openDialogAddtag() {
    dialogAddTag.value.openDialog()
  }
  // epub漫画文件上传对话框
  const dialogEpub = ref(null)
  function openDialogEpub () {
    dialogEpub.value.open()
  }

  // app 全局状态管理
  const isR18 = useR18ModeStore().isR18

  // 组件数据
  const comicCardsData = ref(null)
  const comicNumber = ref(0)
  const tagRanking = ref(null)
  const loaded = ref(false)

  // 组件数据请求
  async function getData () {
    const comicCardsRes = await comicAPI.getComicCardsData()
    comicCardsData.value = comicCardsRes.data
    comicNumber.value = filteredComicCardsData.value.length
    loaded.value = comicCardsRes.loaded
  }
  async function getCategoryTags () {
    const comicCategoryTagsRes = await categoryTagsAPI.getCategoryTagsNumber()
    if (comicCategoryTagsRes.success) {
      if (!isR18) {
        tagRanking.value =  _.filter(comicCategoryTagsRes.data, tag => !tag.is_r18).slice(0, 3)
      }
      else {
        tagRanking.value = _.filter(comicCategoryTagsRes.data, tag => tag.is_r18).slice(0, 3)
      }
    }
  }

  // 组件漫画卡片排序规则
  const sortOptions = [
    {label: "名称", value: "name"},
    {label: "添加日期", value: "add_date"}
  ]
  const orderOptions = [
    { label: '递增', value: 'asc' },
    { label: '递减', value: 'desc' }
  ]
  const SORT_KEY = 'my-sort-field'
  const ORDER_KEY = 'my-sort-order'

  const currentSort = ref(localStorage.getItem(SORT_KEY) || 'name')
  const currentOrder = ref(localStorage.getItem(ORDER_KEY) || 'asc')

  // 漫画卡片数据处理(过滤,排序)方法，计算属性
  const filteredComicCardsData =  computed(() => {
    if (!isR18) {
      return _.filter(comicCardsData.value, card => !card.is_r18)
    }
    return comicCardsData.value
  })

  const sortedComicCards = computed(() => {
    if (loaded.value && filteredComicCardsData.value.length > 0) {
      const sortKey = currentSort.value === 'name' ? 'name' : 'add_date'
      const sortData = _.sortBy(filteredComicCardsData.value, sortKey)
      return currentOrder.value === 'asc' ? sortData :  sortData.reverse()
    }
  })

  function onSortChanged(command) {
    if (['asc', 'desc'].includes(command)) {
      currentOrder.value = command
    }
    else currentSort.value = command
  }

  // 监听设置数据变化
  // 排序
  watch(currentSort, value => {localStorage.setItem(SORT_KEY, value)})
  watch(currentOrder, value => {localStorage.setItem(ORDER_KEY, value)})

  // 组件挂载操作
  onMounted(() => {
    getData()
    getCategoryTags()
  })

  // 组件提供的方法
  provide("getComicCardsData", getData)
</script>

<template>
  <PvoDialogUploadComicFolder ref="lgmDialogUploadComicFolder"/>
  <PvoDialogAddComicTag ref="dialogAddTag"/>
  <pvo-dialog-epub ref="dialogEpub"/>
  <header class="overview">
    <div class="pull-left">
      <el-menu class="el-menu--horizontal" mode="horizontal" :ellipsis="false">
        <el-sub-menu index="1">
          <template #title><el-icon><folder-add/></el-icon>添加漫画</template>
          <el-menu-item @click="callChildFunc" index="1-1">
            <el-icon><ri-file-image-line/></el-icon>
            <template #title>图片文件</template>
          </el-menu-item>
          <el-menu-item index="1-2">
            <el-icon><FontAwesomeIcon :icon="faFileZipper"/></el-icon>
            <template #title>压缩文件</template>
          </el-menu-item>
          <el-menu-item index="1-3" @click="openDialogEpub">
            <el-icon><ri-file-pdf-line/></el-icon>
            <template #title>epub文件</template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="2" @click="openDialogAddtag">
          <el-icon><CollectionTag /></el-icon>
          <template #title>添加Tag</template>
        </el-menu-item>
      </el-menu>
      <el-dropdown @command="onSortChanged" trigger="click">
        <el-button class="border-none">
          <el-icon class="el-icon--left"><Sort/></el-icon>
          排序
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in sortOptions"
                              :key="item.value"
                              :command="item.value"
            >
              <div class="flex items-center w-4">
                <el-icon v-if="item.value === currentSort"
                         class="el-icon--left"
                         size="6">
                  <RiCircleFill/>
                </el-icon>
              </div>
              {{item.label}}
            </el-dropdown-item>
            <el-divider class="my-1"/>
            <el-dropdown-item v-for="item in orderOptions"
                              :key="item.value"
                              :command="item.value"
            >
              <div class="flex items-center w-4">
                <el-icon v-if="item.value === currentOrder"
                           class="el-icon--left"
                           size="6">
                  <RiCircleFill/>
                </el-icon>
              </div>
              {{item.label}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="pull-right">
      <div class="tag-ranking">
        <div class="tag-ranking-title">Tag排行榜</div>
        <div class="tag-ranking-tags">
          <ul>
            <li v-for="tag in tagRanking">
              <div>{{tag.number}}</div>
              <el-tag  type="info" effect="dark">{{tag.category_tag_name}}</el-tag>
            </li>
          </ul>
        </div>
      </div>
      <el-statistic title="作品合计" :value="comicNumber"></el-statistic>
    </div>
  </header>

  <div id="comic-cards-container" class="comic-reader-grid">
    <PvoComicCard v-for="data in sortedComicCards" :id="data.id" :comic_name="data.name"
                  :comic_cover_src="data.cover_image_file_url" :comic_tags="data.tags" :is_star="data.is_started"
    />
  </div>
</template>

<style scoped>
.overview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  padding: 10px 20px;
  margin-bottom: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.overview:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.pull-left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
}

.pull-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
}

.tag-ranking {
  min-width: 200px;
  padding: 10px 15px;
  background-color: #f9f9f9;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.tag-ranking:hover {
  background-color: #f5f5f5;
}

.tag-ranking-title {
  color: #303133;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  margin-bottom: 8px;
  position: relative;
  padding-left: 10px;
}

.tag-ranking-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 14px;
  background-color: #ff7a00;
  border-radius: 3px;
}

.tag-ranking-tags ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.tag-ranking-tags ul li {
  display: flex;
  align-items: center;
  gap: 5px;
  transition: transform 0.2s ease;
}

.tag-ranking-tags ul li:hover {
  transform: translateY(-2px);
}

.tag-ranking-tags ul li div {
  font-size: 12px;
  font-weight: 600;
  color: #ff7a00;
  background-color: rgba(255, 122, 0, 0.1);
  padding: 2px 6px;
  border-radius: 10px;
}

.comic-reader-grid {
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  padding: 10px;
  margin-bottom: 40px;
}

@media (max-width: 768px) {
  .overview {
    flex-direction: column;
    height: auto;
    padding: 15px;
    gap: 15px;
  }

  .pull-left, .pull-right {
    width: 100%;
    justify-content: center;
  }

  .tag-ranking {
    width: 100%;
    min-width: auto;
  }

  .comic-reader-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
  }
}

/* 添加一些动画效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

#comic-cards-container {
  animation: fadeIn 0.5s ease-out;
}

/* 为漫画卡片添加进入动画 */
:deep(.comic-card) {
  animation: fadeIn 0.5s ease-out;
  animation-fill-mode: both;
}

:deep(.comic-card:nth-child(10n+1)) { animation-delay: 0.05s; }
:deep(.comic-card:nth-child(10n+2)) { animation-delay: 0.1s; }
:deep(.comic-card:nth-child(10n+3)) { animation-delay: 0.15s; }
:deep(.comic-card:nth-child(10n+4)) { animation-delay: 0.2s; }
:deep(.comic-card:nth-child(10n+5)) { animation-delay: 0.25s; }
:deep(.comic-card:nth-child(10n+6)) { animation-delay: 0.3s; }
:deep(.comic-card:nth-child(10n+7)) { animation-delay: 0.35s; }
:deep(.comic-card:nth-child(10n+8)) { animation-delay: 0.4s; }
:deep(.comic-card:nth-child(10n+9)) { animation-delay: 0.45s; }
:deep(.comic-card:nth-child(10n+10)) { animation-delay: 0.5s; }
</style>