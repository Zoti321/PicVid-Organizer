<script setup>
  import {Search, Sunny, Moon, MoonNight} from "@element-plus/icons-vue";
  import {computed, ref, watch} from "vue";
  import {useRouter, useRoute} from "vue-router";

  // 路由
  const route = useRoute()
  const router = useRouter()
  // 组件变量
  // 页头输入框
  const input = ref('')
  const placeholders = ['搜索', '作品,标签,作者等...']
  const currentPlaceholder = ref(placeholders[0])
  // 昼夜主题切换
  const isNightTheme = ref(false)
  // 输入框过滤属性
  const filter = ref('')

  // 组件计算属性
  const currentPath = computed(() => route.path)

  // 组件函数
  // 根据焦点状态改变输入框 placeholder
  const onFocus = () => {
    currentPlaceholder.value = placeholders[1]
  }
  const onBlur = () => {
    currentPlaceholder.value = placeholders[0]
  }
  // 回到上一个页面
  function goBack () {
    router.back()
  }

  // 动态面包屑导航
  const menuItems = [
    {name: '主页', path: '/'},
    {name: '本子资源', children: [
        {name: '漫画', path: '/benzi/comics'},
        {name: '图片合集', path: '/benzi/image-set'}
      ]
    },
    {name: '多媒体资源', children: [
        {name: '3D作品', path: '/media/3D'},
        {name: '里番', path: '/media/ero-animation'},
        {name: 'av', path: '/media/av'},
        {name: '音声漫画', path: '/media/sound-comic'}
      ]
    },
    {name: '资源管理', path: '/resource-management'},
    {name: '设置', path: '/settings'},
  ]
  function findBreadcrumb(items, path, breadcrumb = []) {
    for (const item of items) {
      breadcrumb.push({name: item.name, path: item.path})

      if (item.path === path) {
        return breadcrumb
      }

      if (item.children) {
        const result = findBreadcrumb(item.children, path, [...breadcrumb])
        if (result) return result
      }

      breadcrumb.pop()
    }
    return null
  }
  const breadcrumbs = computed(() => {
    const result = findBreadcrumb(menuItems, currentPath.value)
    return result || []
  })


</script>

<template>
    <header class="flex justify-between items-center box-border w-full h-[60px] px-5 py-0 border-b border-solid border-[#dcdfe6]
    sticky left-0 top-0 bg-white z-50"
    >
      <div class="flex justify-start items-center gap-1">
        <el-page-header @back="goBack" title="返回">
          <template #content>
            <el-breadcrumb separator="/">
              <template v-for="breadcrumb of breadcrumbs">
                <el-breadcrumb-item>
                  <router-link v-if="breadcrumb.path" :to="breadcrumb.path">{{breadcrumb.name}}</router-link>
                  <span v-else>{{breadcrumb.name}}</span>
                </el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </template>
        </el-page-header>
      </div>
      <div class="flex justify-center items-center">
        <div class="flex justify-center items-center">
          <el-input v-model="input" :placeholder="currentPlaceholder"
                    :prefix-icon="Search" @focus="onFocus" @blur="onBlur"
                    clearable style="width: 300px">
            <template #prepend>
              <el-select style="width: 100px" v-model="filter" placeholder="作品筛选" clearable>
                <el-option label="漫画" value="1" />
                <el-option label="图集" value="2"/>
                <el-option label="3D" value="3"/>
                <el-option label="里番" value="4"/>
              </el-select>
            </template>
          </el-input>
        </div>
        <div class="switch-container">
          <label class="switch">
            <input type="checkbox" v-model="isNightTheme"></input>
            <span>
            <el-icon size="14px"><moon v-if="isNightTheme"/><sunny v-else/></el-icon>
          </span>
          </label>
        </div>
      </div>
    </header>
</template>

<style scoped>
.switch-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 5px;
}
.switch {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 42px;
  height: 22px;
  border-radius: 20px;
  border: 1px solid rgba(60, 60, 60, 0.29);
  background-color: #f1f1f1;
  cursor: pointer;
}
.switch input {
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
}
.switch span {
  position: absolute;
  top: 1px;
  left: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  background-color: #ffffff;
  border-radius: 50%;
  transition: transform 0.3s ease;
}
.switch input:checked ~ span {
  transform: translateX(18px);
}
</style>