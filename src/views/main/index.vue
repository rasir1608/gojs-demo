<template lang="pug">
  .gojs-demo
    #my-diagram
    #my-overview
    #job-detail-info(:style='jobDetailStyle',@mousemove='jobDetailMouseOver')
      .info-item(v-for="(key,index) in Object.keys(currentJobForShow)")
        .info-item-label {{key}}：
        .info-item-value {{currentJobForShow[key]}}
    #node-context-menu(ref="node-context-menu")
      ul.root-menu
        li(v-for="(item,index) in nodeMenu",@click.stop="handleNodeMenu(item.value,index)") {{item.label}}
          ul.sub-menu-1(v-if="Array.isArray(item.children) && item.children.length > 0")
            li(v-for="(subItem,index) in item.children",@click.stop="handleNodeMenu(subItem.value,index)") {{subItem.label}}
    .control
      button(@click.stop='saveDate') 保存
      button(@click.stop='reloadDate') 重载
</template>
<script>
import 'static/lib/go-debug';
import goTool from '@/lib/go-tools';
import utils from '@/lib/util';
import { jobDate, jobLink } from 'static/lib/mock';

export default {
  data() {
    return {
      currentJobForShow: {},
      jobDetailStyle: {},
       nodeMenu: [{
        label: '重跑',
        value: 'rerun',

      },
      {
        label: '任务详情',
        value: 'detail',
      },
        {
        label: '任务操作',
        value: 'operate',
        children: [],
      },
      {
        label: '查看依赖',
        value: 'deps',
      },
      {
        label: '查看日志',
        value: 'log',
      }],
      lastStroked: null,
      diagram: '',
      modelDate: '',
    };
  },
  mounted() {
    const self = this;
    goTool.config = {
      nodeMouseOverCb: this.getJobDetail,
      nodeMouseLeave: () => {
        self.jobDetailStyle = {
          display: 'none',
        };
      },
      modified: () => {
      },
      nodeContextMenu: this.$refs['node-context-menu'],
      overview: true,
    };
    this.diagram = goTool.startGojs(jobDate.map((e) => {
      e.key = e.id;
      return e;
    }), this.getNodeLink(jobLink));
  },
  methods: {
    jobDetailMouseOver(e) {
      e = e || window.event;
      this.jobDetailStyle = {
        left: `${e.clientX + 30}px`,
        top: `${e.clientY}px`,
      };
    },
    getNodeLink(jobLinks) {
      const link = [];
      if (Array.isArray(jobLinks)) {
        jobLinks.forEach((e) => {
          if (Array.isArray(e.pre) && e.pre.length > 0) {
            e.pre.forEach((el) => {
              if (link.findIndex(item => item.from === el && item.to === e.id) === -1) {
                link.push({
                  from: el,
                  to: e.id,
                });
              }
            });
          }
          if (Array.isArray(e.sub) && e.sub.length > 0) {
            e.sub.forEach((el) => {
              if (link.findIndex(item => item.from === e.id && item.to === el) === -1) {
                link.push({
                  from: e.id,
                  to: el,
                });
              }
            });
          }
        });
      }
      return link;
    },
    getJobDetail(mousePos, job) {
      this.jobDetailStyle = {
        left: `${mousePos.x + 30}px`,
        top: `${mousePos.y}px`,
        display: 'block',
      };
      this.currentJobForShow = {
                实例ID: job.id,
                任务ID: job.taskId,
                任务名称: job.name,
                任务类型: job.taskType,
                开始时间: job.beginTime ? utils.formatTime(job.beginTime, 'yyyy-MM-dd HH:mm:ss') : '---',
                结束时间: job.endTime ? utils.formatTime(job.endTime, 'yyyy-MM-dd HH:mm:ss') : '---',
                业务时间: job.scheduleTime ? utils.formatTime(job.scheduleTime, 'yyyy-MM-dd HH:mm:ss') : '---',
                运行状态: job.state,
        };
        if (job.beginTime && job.endTime) {
            this.currentJobForShow['运行时长'] = `${parseInt((job.endTime - job.beginTime) / 1000)}s`;
        } else {
            this.currentJobForShow['运行时长'] = '---';
        }
    },
    handleNodeMenu(value, index) {
      console.log(value, index);
    },
    saveDate() {
      console.log(151);
      this.modelDate = this.diagram.model.toJson();
      console.log(JSON.parse(this.modelDate));
      this.diagram.isModified = false;
    },
    reloadDate() {
      console.log('reload');
      this.diagram.model = window.go.Model.fromJson(this.modelDate);
    },
  },
};
</script>
<style lang="scss">
  .gojs-demo{
    width: 100%;
    height: 100%;
    position: relative;
     #my-diagram{
       width: 100%;
       height: 100%;
       border: 1px solid #666666;
     }
      #my-overview{
        width: 20%;
        height: 20%;
        position: absolute;
        left: 20px;
        top: 20px;
        border: 1px solid #666666;
      }
      #job-detail-info{
      padding: 10px;
      background: rgba(0,0,0,0.5);
      color: #ffffff;
      font-size: 14px;
      position: fixed;
      z-index: 3;
      display: none;
      .info-item{
        @include ra-clear();
        line-height: 30px;
        .info-item-label{
          width: 80px;
          float: left;
          text-align: right;
        }
        .info-item-value{
          float:left;
        }
      }
    }
    #node-context-menu{
      display: none;
      position: fixed;
      z-index: 4;
      ul{
        color: #000;
        background: #ffffff;
        line-height: 36px;
        width: 100px;
        border: 1px solid #dcdcdc;
        box-shadow: 0 0 20px;
        border-radius: 4px;
      }
      ul.root-menu{
        text-align: center;
        cursor: pointer;
        li{
          position: relative;
          height: 36px;
          ul.sub-menu-1{
            position: absolute;
            left: 100px;
            top: 0;
            display: none;
          }
          &:hover{
            background: #dcdcdc;
             ul.sub-menu-1{
               display: block;
             }
          }
        }
      }
    }
    .control{
      position: absolute;
      right: 20px;
      top: 20px;
      z-index: 9;
      button{
        @include ra-btn($white,$pr,$blue);
        @include ra-hover($pr);
      }
    }
  }
</style>
