<template lang="pug">
section.bdp-content
  router-view
</template>
<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
    };
  },
  methods: {
    ...mapActions([
      'userLogin', 'getRoles', 'userLogOut',
    ]),
    handleSelectr() {
    },
    toIndex() {
      this.$router.push({
        path: '/',
      });
    },
  },
};

</script>
<style lang="scss">
.bdp-content{
  width: 100%;
  height: 100%;
}
.sf-top-menu.el-menu--horizontal{
  background-color:#fff;
  .el-menu-item{
    padding:0 63px;
    margin:0 0px 0 33px;
    font-size: 16px;
    color: #5D5D7C;
    height: auto;
    line-height:47px;
    &.is-active{
      color: #60607E;
      border-bottom: 5px solid #007DFD;
    }
    &:hover{
      border-bottom-color:#007DFD;
    }
  }
}
.main{
  header{
    img.logo{
      cursor: pointer;
    }

  }
}
</style>
