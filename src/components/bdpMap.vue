<template lang="pug">
.km
  .bdp-map(:id="id")
</template>

<script>
export default {
  props: ['id', 'flyData', 'bdpData'],
  data() {
    return {
      geoCoordMap: {
        深圳: [114.06667, 22.61667],
        上海: [121.43333, 34.50000],
        北京: [116.41667, 39.91667],
      },
    };
  },
  mounted() {
    const id = document.getElementById(this.id);
    if (!id) return;
    this.myChart = this.echarts.init(id);
    window.onresize = () => (() => {
      this.myChart.resize();
    })();
    // 绘制飞机图形
    this.myChart.setOption(this.inits());
  },
  methods: {
    inits() {
      const option = {
        geo: {
          map: 'china',
          label: {
            emphasis: {
              show: false,
            },
          },
          itemStyle: {
            normal: {
              borderColor: 'rgba(100,149,237,1)',
              borderWidth: 1.5,
              areaColor: 'rgba(11,33,67,0.3)',
            },
            emphasis: {
              areaColor: 'rgba(11,33,67,0.3)',
              // borderWidth: 5,
              // areaColor: '#32cd32',
              label: {
                shadowColor: 'green', // 默认透明
                // shadowBlur: 10,
                show: true,
              },
            },
          },
        },
        series: [],
      };
      return option;
    },
    convertData(data) {
      const $vm = this;
      const res = [];
      data.forEach((v) => {
        const arr = $vm.geoCoordMap[v];
        res.push({
          name: v,
          value: arr.concat(v.value),
        });
      });
      return res;
    },
    draw() {
      const $vm = this;

      const planePath =
        'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
      const arr1 = [];
      // const arr2 = [];
      const arr3 = [];
      this.EffectScatter.forEach((v) => {
        const from = v.departCityName; // 出发
        const to = v.arriveCityName; // 到达
        if (arr1.indexOf(from) === -1) {
          arr1.push(from);
        }
        if (arr1.indexOf(to) === -1) {
          arr1.push(to);
        }
        arr3.push({
          fromName: from,
          toName: to,
          coords: [
            $vm.geoCoordMap[from],
            $vm.geoCoordMap[to],
          ],
        });
      });
      const sfcar = [];
      const rdata1 = $vm.convertData(arr1);
      this.sfGoods.forEach((v) => {
        const sfcarX = v.x;
        sfcar.push([sfcarX, v.y]);
      });
      const series = [
        {
          name: '',
          type: 'lines',
          zlevel: 2,
          symbolSize: 10,
          effect: {
            show: true,
            period: 6,
            symbol: planePath,
            trailLength: 0,
            symbolSize: 15,
          },
          label: {
            normal: {
              show: false,
              /* 是否城市名字 */
              textStyle: {
                color: 'rgba(255,255,255,0.2)',
              },
            },
            emphasis: {
              show: false,
            },
          },
          lineStyle: {
            normal: {
              color: '#ffc000',
              width: 2,
              opacity: 0.5,
              curveness: 0.2,
            },
          },
          data: arr3,
        },
        {
          name: '飞机飞行',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: rdata1,
          symbolSize: 8,
          showEffectOn: 'render',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke',
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: true,
            },
            emphasis: {
              show: true,
            },
          },
          itemStyle: {
            normal: {
              color: '#f5dc04',
              shadowBlur: 20,
              shadowColor: '#333',
            },
          },
        },
        {
          name: '货车',
          type: 'scatterGL',
          coordinateSystem: 'geo',
          data: sfcar,
          symbolSize: 10,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            },
          },
          itemStyle: {
            normal: {
              color: '#0efffc',
              shadowBlur: 20,
              shadowColor: '#333',
            },
          },
        },
      ];
      return {
        series,
      };
    },
  },
  watch: {
    EffectScatter: {
      handler(nv) {
        if (nv.length === 0) {
          return;
        }
        this.myChart.setOption(this.drawEffectScatter());
      },
    },
    option: {
      handler() {
      },
    },
  },
};
</script>

<style lang="scss">
.bdp-map {
  min-height: 600px;
}
.palanDetal{
    display: inline-block;
    color: #fff;
    width: 448px;
    text-align: left;
    height: 334px;
    position: absolute;
    bottom: 6%;
    right: 6%;
    font-size: 18px;
    background-color: rgba(32, 131, 248, 0.12);
    .palanDetal1{
      // padding: 24px 0 24px 33px;
      ul li{
        margin-bottom: 15px;
      }
      ul li:last-child{
        margin-bottom: 0;
      }
  }
}
</style>
