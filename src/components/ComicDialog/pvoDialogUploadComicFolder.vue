<script setup>
  import {reactive, ref, onMounted, computed, inject} from "vue";
  import {Close, Document, CircleCheck} from "@element-plus/icons-vue"
  import comicAPI from "../../api/comic/comic.js"
  import categoryTagsAPI from "../../api/comic/categoryTags.js"

  // 组件注入的方法
  const getComicCardsData = inject('getComicCardsData')

  // 组件变量
  const dialogVisible = ref(false)
  const categoryTagsData = ref(null)
  const categoryTagsDataLoaded = ref(false)

  // 请求漫画分类标签数据
  const getComicTagsData = async () => {
    const res = await categoryTagsAPI.getAllCategoryTags()
    categoryTagsData.value = res.data
    categoryTagsDataLoaded.value = res.loaded
  }

  // 组件挂载钩子函数
  onMounted(() => {
    getComicTagsData()
  })

  // 表单数据
  const comicInformation = ref({
    name: null,
    is_r18: false,
    series: null,
    characters: null,
    tags: null,
    authors: null,
    narrate: '',
  })
  const comicImages = ref([])
  const formRef = ref(null)

  // 表单数据验证
  const rules = {
    name : [
      {required: true, message: '请输入漫画名', trigger: 'blur'}
    ]
  }

  // 表单数据提交
  const submit = () => {
    formRef.value.validate(async (valid) => {
      if (valid && comicImages.value.length > 0) {
        const data = {
          name: comicInformation.value.name,
          is_r18: comicInformation.value.is_r18,
          series: comicInformation.value.series,
          characters: comicInformation.value.characters,
          tags: comicInformation.value.tags,
          authors: comicInformation.value.authors,
          narrate: comicInformation.value.narrate,
          image_files: comicImages.value,
        }
        const res = await comicAPI.postAddComic(data)
        if (res.success) {
          clearFormData()
          clearAllFiles()
          await getComicCardsData()
        }
      }
    })
  }

  // 控制文件显示列表
  const headCount = 4
  const tailCount = 4
  const headImages = computed(() => {
    if (isCollapesd.value) {
      return comicImages.value.slice(0, headCount)
    }
  })
  const tailImages = computed(() => {
    if (isCollapesd.value) {
      return comicImages.value.slice(-tailCount)
    }
  })
  const isCollapesd = computed(() => {
    return comicImages.value.length > headCount + tailCount
  })

  // 控制文件显示列表的li元素
  const fileHoverState = ref({})
  const changeIcon = (type, index) => {
    type === 'hover' ? fileHoverState.value[index] = true : fileHoverState.value[index] = false
  }
  // 删除选中文件
  const clearFile = (type, index) => {
    if (type === 'few') {
      comicImages.value.splice(index, 1)
    }
    if (type === 'head') {
      comicImages.value.splice(index, 1)
    }
    if (type === 'tail') {
      const targetIndex = index - tailCount
      comicImages.value.splice(targetIndex, 1)
    }
  }

  // 组件函数方法
  const changeDialogVisible = () => {
    dialogVisible.value = !dialogVisible.value
  }
  const closeDialog = () => {
    dialogVisible.value = false
  }
  // 清空表单数据
  const clearFormData = () => {
    comicInformation.value.name = ''
    comicInformation.value.series = []
    comicInformation.value.characters = []
    comicInformation.value.tags = []
    comicInformation.value.authors = []
    comicInformation.value.narrate = ''
    comicImages.value.splice(0, comicImages.value.length)
  }
  // 清空文件
  const clearAllFiles = () => {
    comicImages.value.splice(0, comicImages.value.length)
  }

  // 组件暴露方法
  defineExpose({
    changeDialogVisible
  })
</script>

<template>
  <teleport to="body">
    <el-dialog class="dialog" v-model="dialogVisible" top="5vh" width="800px" center>
      <template #header>
        <h2>上传漫画</h2>
      </template>

      <section class="mb-4">
        <div class="form-left">
          <el-form :model="comicInformation" ref="formRef" :rules="rules" action="http://localhost/api/upload-comic">
            <el-form-item label="漫画名称" required prop="name">
              <el-input placeholder="请输入漫画名称" v-model="comicInformation.name"/>
            </el-form-item>
            <el-form-item label="R18">
              <el-switch v-model="comicInformation.is_r18"/>
            </el-form-item>
            <el-form-item label="作品">
              <el-select placeholder="输入作品" v-model="comicInformation.series"
                         multiple collapse-tags collapse-tags-tooltip filterable allow-create>
                <el-option v-for="series_i in categoryTagsData.series"
                           :key="`series-${series_i.id}`"
                           :label="series_i.name"
                           :value="series_i.name"/>
              </el-select>
            </el-form-item>
            <el-form-item label="登场人物">
              <el-select placeholder="输入登场人物" v-model="comicInformation.characters"
                         multiple collapse-tags collapse-tags-tooltip filterable allow-create>
                <el-option v-for="character in categoryTagsData.characters"
                           :key="`character-${character.id}`"
                           :label="character.name"
                           :value="character.name"/>
              </el-select>
            </el-form-item>
            <el-form-item label="标签">
              <el-select placeholder="输入标签" v-model="comicInformation.tags"
                         multiple collapse-tags collapse-tags-tooltip filterable allow-create>
                <el-option v-for="tag in categoryTagsData.tags"
                           :key="`tag-${tag.id}`"
                           :label="tag.name"
                           :value="tag.name"/>
              </el-select>
            </el-form-item>
            <el-form-item label="作者">
              <el-select placeholder="输入作者" v-model="comicInformation.authors"
                         multiple collapse-tags collapse-tags-tooltip filterable allow-create>
                <el-option v-for="author in categoryTagsData.authors"
                           :key="`author-${author.id}`"
                           :label="author.name"
                           :value="author.name"/>
              </el-select>
            </el-form-item>
            <el-form-item label="叙述" style="margin: 0">
              <el-input type="textarea" v-model="comicInformation.narrate" placeholder="输入漫画叙述"
                        :autosize="{minRows: 3}"/>
            </el-form-item>
          </el-form>
        </div>
        <div class="form-right">
          <el-upload v-model:file-list="comicImages" class="upload-comic-files"
                     multiple :show-file-list="false" :auto-upload="false"
          >
            <el-button type="primary">上传漫画文件</el-button>
            <template #tip>单个文件大小不超过500MB</template>
          </el-upload>
          <ul class="upload-files-display" v-if="comicImages.length !== 0">
            <li v-if="!isCollapesd" v-for="(file, index) in comicImages" :key="index"
                @mouseenter="changeIcon('hover', index)"
                @mouseleave="changeIcon('default', index)">
              <div>
                <el-icon><document/></el-icon>
                <span>{{file.name}}</span>
              </div>
              <label @click="clearFile('few', index)">
                <el-icon>
                  <close v-if="fileHoverState[index]"/>
                  <circle-check v-else style="color: var(--el-color-success)"/>
                </el-icon>
              </label>
            </li>
            <li v-for="(file, index) in headImages" :key="`head-${index}`"
                @mouseenter="changeIcon('hover', `head-${index}`)"
                @mouseleave="changeIcon('default', `head-${index}`)">
              <div>
                <el-icon><document/></el-icon>
                <span>{{file.name}}</span>
              </div>
              <label @click="clearFile('head', index)">
                <el-icon>
                  <close v-if="fileHoverState[`head-${index}`]"/>
                  <circle-check v-else style="color: var(--el-color-success)"/>
                </el-icon>
              </label>
            </li>
            <li class="upload-files-ellipsis" v-if="isCollapesd">...</li>
            <li v-for="(file, index) in tailImages" :key="`tail-${index}`"
                @mouseenter="changeIcon('hover', `tail-${index}`)"
                @mouseleave="changeIcon('default', `tail-${index}`)">
              <div>
                <el-icon><document/></el-icon>
                <span>{{file.name}}</span>
              </div>
              <label @click="clearFile('tail', index)">
                <el-icon>
                  <close v-if="fileHoverState[`tail-${index}`]"/>
                  <circle-check v-else style="color: var(--el-color-success)"/>
                </el-icon>
              </label>
            </li>
          </ul>
          <div class="upload-comic-files-overview">
            <p>总共 <span>{{comicImages.length}}</span> 个文件</p>
            <el-button plain @click="clearAllFiles">清除所有文件</el-button>
          </div>
        </div>
      </section>

      <template #footer>
        <div class="flex justify-between">
          <div>
            <el-button>重置</el-button>
          </div>
          <div>
            <el-button type="primary" @click="submit">确认</el-button>
            <el-button plain type="info" @click="closeDialog">取消</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </teleport>
</template>

<style scoped>
  section {
    display: flex;
    justify-content: center;
    align-items: start;
    gap: 20px;
    height: 350px;
    padding: 0 15px;
  }
  .form-left {
    width: 60%;
    height: 100%;
  }
  .el-form {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .form-right {
    width: 40%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
  .upload-comic-files {
    display: flex;
    flex-direction: column;
  }
  .upload-files-display {
    border: 1px solid #ccc;
    border-radius: 8px;
    margin: 0;
    padding: 3px 0;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    list-style-type: none;
  }
  .upload-files-display li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    border-radius: 4px;
    width: 100%;
    padding: 2px 5px;
    text-align: center;
  }
  .upload-files-display li:hover {
    background-color: #f5f7fa;
  }
  .upload-files-display li div {
    flex: 1;
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 5px;
    height: 100%;
    cursor: pointer;
  }
  .upload-files-display li div:hover {
    color: #409eff;
  }
  .upload-files-display label {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .upload-files-display label:hover {
    color: #409eff;
  }
  .upload-files-ellipsis {
    text-align: start;
  }
  .upload-comic-files-overview {
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 10px;
    width: 100%;
    text-align: start;
  }
  .upload-comic-files-overview span{
    font-weight: bold;
    font-style: italic;
    color: #409eff;
  }
</style>