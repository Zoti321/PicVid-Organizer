<script setup>
  import {ref} from 'vue'
  import {Expand, Fold, HomeFilled, Notebook, Operation, Setting, VideoCamera} from "@element-plus/icons-vue";

  const isCollapse = ref(false)

  const changeIsCollapse = () => {
    isCollapse.value = !isCollapse.value
  }
</script>

<template>
  <transition name="slide">
    <el-menu class="el-menu--vertical app-aside" :collapse="isCollapse" role="menubar" router >
      <el-menu-item @click="changeIsCollapse" class="nav-control">
        <el-icon v-if="isCollapse"><Expand/></el-icon>
        <el-icon v-else><Fold/></el-icon>
      </el-menu-item>
      <el-menu-item index="/">
        <el-icon><HomeFilled/></el-icon>
        <template #title>主页</template>
      </el-menu-item>
      <el-sub-menu index="benzi">
        <template #title>
          <el-icon><Notebook /></el-icon>
          <span>本子资源</span>
        </template>
        <el-menu-item index="/benzi/comics">
          <template #title>漫画</template>
        </el-menu-item>
        <el-menu-item index="/benzi/image-set">
          <template #title>图片合集</template>
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="media">
        <template #title>
          <el-icon><VideoCamera /></el-icon>
          <span>多媒体资源</span>
        </template>
        <el-menu-item index="/media/3D">
          <template #title>3D作品</template>
        </el-menu-item>
        <el-menu-item index="/media/ero-animation">
          <template #title>里番</template>
        </el-menu-item>
        <el-menu-item index="/media/av">
          <template #title>av</template>
        </el-menu-item>
        <el-menu-item index="/media/sound-comic">
          <template #title>音声漫画</template>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/resource-management">
        <el-icon><Operation/></el-icon>
        <template #title>资源管理</template>
      </el-menu-item>
      <el-menu-item index="/settings">
        <el-icon><Setting/></el-icon>
        <template #title>设置</template>
      </el-menu-item>
    </el-menu>
  </transition>

</template>

<style scoped>
.app-aside {
  position: sticky;
  top: 0;
  left: 0;
  max-width: 250px;
  height: 100vh;
  transition: width 0.3s ease;
  background-color: #ffffff;
  z-index: 1000;
}
.el-menu--vertical > .el-menu-item:nth-child(5) {
  margin-top: auto;
}


.slide-enter-active {
  animation: slide-in 0.3s ease;
}
.slide-leave-active {
  animation: slide-out 0.3s ease;
}
@keyframes slide-in {
  from {
    transform: translateX(-100%);
    opacity: 0
  }
  to {
    transform: translateX(0);
    opacity: 1
  }
}
@keyframes slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}
</style>