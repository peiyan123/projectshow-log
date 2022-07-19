<template>
  <div>
    <a-layout>
      <a-layout-conent style="height: 100%;">
        <router-view />
      </a-layout-conent>
    </a-layout>
  </div>
</template>

<script>
//import PageHeader from './components/header.vue';
export default {
  components: {
    //PageHeader,
  },
}
</script>
<style lang="less" scoped>
.ant-layout {
  background: #ffffff !important;
  height: 100%;
}
</style>
