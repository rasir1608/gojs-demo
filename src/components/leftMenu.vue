<template lang='pug'>
div.bdp-silder
  ul.bdp-menu
    li(v-for="menu in menus",:class="{ bdpMi: !menu.children,bdpMs: menu.children,active: menu.path == activeIndex }",v-if="menu.meta")
      div.bdp-menu-submenu-title(v-if="menu.children")
        span
          //- icon.title(name="tachometer")
          span {{menu.meta.title}}
        //- icon.angle(name="angle-down")
      ul.bdp-menu-sub(v-if="menu.children && child.meta",v-for="child in menu.children")
        li.bdp-menu-item
          router-link(:to="child.path")
            span {{child.meta.title}}
      router-link(:to="menu.path",v-if="!menu.children",)
        //- icon.title(name="tachometer")
        span {{menu.meta.title}}
</template>
<script>


export default {
  name: 'leftMenu',
  props: ['menus'],
  data() {
    return {
      activeIndex: this.$route.path,
      // menus: menus[0].children,
      // menus: menus[0].children,
    };
  },
  mounted() {
  },
};
</script>
<style lang="scss">

</style>
