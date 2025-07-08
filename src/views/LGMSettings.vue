<script setup>
  import {ref, watch} from "vue";
  import {useR18ModeStore} from "../stores/r18ModeStore.js"

  // app r18模式状态管理
  const r18ModeStore = useR18ModeStore()

  // 组件数据
  const r18_mode = ref(r18ModeStore.isR18)

  // 组件函数方法
  function changR18ModeStore() {
    r18ModeStore.changeR18Mode()
  }

  // 监听数据变化
  watch(r18_mode, (value) => {
    r18ModeStore.changeR18Mode(value)
  })
</script>

<template>
  <section class="flex flex-col gap-2 ml-6">
    <h2 class="text-2xl font-semibold mb-4">设置</h2>
    <div class="flex items-center space-x-2">
      <span>R18模式</span>
      <el-switch
          v-model="r18_mode"
      />
    </div>

  </section>
</template>

<style scoped>

</style>