<template lang="pug">
  #app
    section.ra-content
      router-view(:key="key")
</template>

<script>
import LeftMenu from './components/leftMenu';

export default {
  name: 'app',
  components: {
    LeftMenu,
  },
  // 同组件刷新
  computed: {
    key() {
      return this.$route.meta ? this.$route.meta.title + new Date() : this.$route + new Date();
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss">
#app {
  .ra-content{
    width: 100%;
    height: 100%;
  }
}
</style>
