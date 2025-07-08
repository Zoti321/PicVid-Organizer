<script setup>
  import {computed, reactive, ref} from "vue";
  import axios from "axios";
  import {ElMessage} from "element-plus";
  import categoryTagsAPI from "../../api/comic/categoryTags.js";

  // 组件数据变量
  // 对话框可视化变量
  const dialogVisible = ref(false)
  // 表单数据
  const formData = ref({
    series: [],
    characters: [],
    tags: [],
    authors: [],
  })

  // 组件函数方法
  // 提交表单数据
  const submit = async () => {
    if ( !checkEmpty() ) {
      const data = {
        series: formData.value.series,
        characters: formData.value.characters,
        tags: formData.value.tags,
        authors: formData.value.authors,
      }
      await categoryTagsAPI.postAddCategoryTags(data)
      clearFormData()
    }
  }
  // 表单数据校验
  const checkEmpty = () => {
    const isBlank = formData.value.series.length === 0 && formData.value.characters.length === 0 &&
        formData.value.tags.length === 0 && formData.value.authors.length === 0

    if (isBlank) {
      ElMessage({
        message: "表单数据不能全部为空",
        type: "warning"
      })
      return true
    }
    else return false
  }
  // 关闭对话框
  const closeDialog = () => {
    dialogVisible.value = false
  }
  // 清除表单数据
  const clearFormData = () => {
    formData.value.series = []
    formData.value.characters = []
    formData.value.tags = []
    formData.value.authors = []
  }
  // 打开对话框
  const openDialog = () => {
    dialogVisible.value = true
  }

  // 组件对外暴露方法
  defineExpose({
    openDialog
  })
</script>

<template>
  <teleport to="body">
    <el-dialog class="dialog" v-model="dialogVisible" top="5vh" width="400px" center>
      <template #header>
        <h2>添加Tag</h2>
      </template>
      <section>
        <el-form :model="formData">
          <el-form-item label="作品">
            <el-input-tag v-model="formData.series"></el-input-tag>
          </el-form-item>
          <el-form-item label="登场人物">
            <el-input-tag v-model="formData.characters"></el-input-tag>
          </el-form-item>
          <el-form-item label="标签">
            <el-input-tag v-model="formData.tags"></el-input-tag>
          </el-form-item>
          <el-form-item label="作者">
            <el-input-tag v-model="formData.authors"></el-input-tag>
          </el-form-item>
        </el-form>
      </section>
      <template #footer>
        <div class="dialog-footer">
          <el-button plain type="primary" @click="submit">确认</el-button>
          <el-button plain type="info" @click="closeDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </teleport>
</template>

<style scoped>

</style>