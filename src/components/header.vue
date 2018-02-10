<template lang="pug">
header.bdp-header
  el-row.row-bg(type="flex",justify="space-between")
    el-col.title(:span="5")
      img(src="/static/sflogo.png")
      .right
        router-link.text-fill(to="/")  Bdp Front Architecture&nbsp;
    el-col(:span='15')
      el-menu(:default-active="activeIndex",mode="horizontal",router)
        el-menu-item(index='/') 首页
    el-col.logout.text-right(:span="4")
      //- icon.user(name="user")
      span {{userName}}
      i(@click="userLogOut")
        //- icon.signOut(name="sign-out")
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      userName: 'userName',
    }),
    activeIndex() {
      return `/${this.$route.path.split('/')[1]}`;
    },
  },
  methods: {
    ...mapActions([
      'userLogin', 'getRoles', 'userLogOut',
    ]),
    // 激活命名空间后使用
    // ...mapActions('global',[
    //   'userLogin', 'getRoles', 'userLogOut',
    // ]),
  },
  mounted() {
    this.userLogin();
  },
};
</script>
<style lang="scss">
.text-fill {
  // background: -webkit-linear-gradient(left, #4f185d , #fe5d4b);     /* 背景色渐变 */
  background: -webkit-linear-gradient(left, #b4e2f0 , #15a1d8);
  -webkit-background-clip: text;         /* 规定背景的划分区域 */
  -webkit-text-fill-color: transparent;  /* 防止字体颜色覆盖 */
  font-style: italic
}
</style>

