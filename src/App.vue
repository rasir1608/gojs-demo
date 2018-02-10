<template lang="pug">
  #app
    //- sfHeader
    section.sf-content
      router-view(:key="key")
</template>

<script>
import LeftMenu from './components/leftMenu';
import sfHeader from './components/header';

export default {
  name: 'app',
  components: {
    LeftMenu,
    sfHeader,
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
  .sf-content{
    width: 100%;
    height: 100%;
  }
}
</style>
