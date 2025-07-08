<script setup>
import {provide, ref} from "vue";
import PvoSideMenu from "./components/pvoSideMenu.vue";
import PvoHeader from "./components/pvoHeader.vue";
import axios from "axios";

axios.defaults.withCredentials = true

const showSideMenu = ref(true)

provide('toggleSideMenu', (value) => {
  showSideMenu.value = value
})

</script>

<template>
  <el-container>
    <PvoSideMenu v-show="showSideMenu"/>
    <el-container class="flex-col">
      <PvoHeader/>
      <el-main class="app-main">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>
