<template>
  <div id="app">
    <router-view />
    <transition name="el-zoom-in-center">
      <div v-show="isRole&&!open" v-drag class="modal-container"
        style="cursor: move;transform: translate(16px, -80px);">
        <i class="el-icon-circle-close"
          style="cursor: pointer;color:#fff;font-size:18px;position: absolute;right:5px;top:5px"
          @click="openctiIframe"></i>
        <div class="modal-header">
          <p>度言</p>
        </div>
        <div id="ctiIframe" class="modal-main"></div>
        <!-- <button v-if="isCallReady" @click="callMe('18667119067')"></button> -->
      </div>
    </transition>
    <transition name="el-zoom-in-center">
      <div class="phone-div" v-show="isRole&&open">
        <i class="el-icon-s-custom phone-icon" @click="openctiIframe"></i>
      </div>
    </transition>
  </div>
</template>

<script>
  import indexApi from "@/api/index";
  export default {
    name: 'App',
    data() {
      return {
        // accountId: null,
        token: null,
        accountId: null,
        isRole: null,
        isCallReady: false,
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 50,
        },
      }
    },
    watch: {
      $route(to, from) {
        if (from.path == '/login') {
          this.getList();
        } else if (from.path == '/' && to.path != '/login') {
          this.getList();
        }
      }
    },
    //注册局部组件指令
    directives: {
      drag: function (el) {
        let dragBox = el; //获取当前元素
        dragBox.onmousedown = e => {
          //算出鼠标相对元素的位置
          let disX = e.clientX - dragBox.offsetLeft;
          let disY = e.clientY - dragBox.offsetTop;
          document.onmousemove = e => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX;
            let top = e.clientY - disY;
            //移动当前元素
            dragBox.style.left = left + "px";
            dragBox.style.top = top + "px";
          };
          document.onmouseup = e => {
            //鼠标弹起来的时候不再移动
            document.onmousemove = null;
            //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）  
            document.onmouseup = null;
          };
        };
      }
    },
    mounted() {
      this.bindCloseBrowser();
    },
    methods: {
      openctiIframe() {
        this.open = !this.open
      },
      //浏览器关闭或刷新事件
    bindCloseBrowser() {
        var a = "注意！！\n您即将离开页面！离开后可能会导致数据丢失\n\n您确定要离开吗？";
        window.onbeforeunload = function (b) {
            b = b || window.event;
            b.returnValue = a;
            return a
        }
    },
      /** 查询token */
      getList() {
        let accountId = JSON.parse(sessionStorage.getItem("accountId"));
        if (accountId) {
          this.accountId = accountId
          indexApi.initBreathe(accountId).then(
            response => {
              if (response.data != 0) {
                sessionStorage.setItem('token', JSON.stringify(response.data));
                this.token = response.data;
                this.isRole = true;
                this.getIframe();
              } else {
                sessionStorage.setItem('token', JSON.stringify(response.data));
              }
            }
          );
        } else {
          this.isRole = null;
          sessionStorage.setItem('token', JSON.stringify(0));
        }
      },
      /** 查询是否是催收员 */
      // getIsRole() {
      //   indexApi.isRoleBreathe().then(
      //     response => {
      //         this.getList();
      //     }
      //   );
      // },
      getIframe() {
        var se = document.createElement('script')
        se.id = 'dySdkScript'
        se.setAttribute('url',
          `https://cti.duyansoft.com?account_id=${this.accountId}&token=${this.token}&noNumberInput=false&noOpBtn=false`
        )
        se.setAttribute('width', '280')
        se.setAttribute('height', '460')
        se.src = 'https://cti.duyansoft.com/syui/dysdk/dysdk2.min.js'

        // js 加载后执行
        se.onload = () => {
          DYSDK.ready(() => {
            // console.log(111)
          })

          DYSDK.callReady(() => {
            // console.log(222)

          })

          DYSDK.callConnecting((data) => {
            if (data.uuid) {}
          })

          DYSDK.callConfirm((data) => {
            if (data.uuid) {} else {
              this.$Message.error('不存在uuid')
            }
          })

          DYSDK.callFail((data) => {

          })

          DYSDK.callEnd((data) => {

          })

          DYSDK.callBridge((data) => {
              if (data.bridgeType == 'start') {
              let result = data.userTag.split("+");
              let id = result[0];
              let name = result[1];
              if (name == 'cUtBeforeInfo') {
                let BeforerouteUrl = this.$router.resolve({
                  path: "cutBeforeInfo",
                  query: {
                    beforeId: id
                  }
                });
                window.open(BeforerouteUrl.href, '_blank');
              } else if (name == 'cUtAfterInfo') {
                let AfterrouteUrl = this.$router.resolve({
                  path: "cutAfterInfo",
                  query: {
                    afterId: id
                  }
                });
                window.open(AfterrouteUrl.href, '_blank');
              }
            }
          })

          DYSDK.getPhonelines((data) => {
            if (data) {
              this.isCallReady = true
            }
          })
          DYSDK.ctiLogout((data) => {
            this.$message.success('“外呼平台已退出，请按需重新登陆');
          })
          DYSDK.init()
        }
        document.getElementById('ctiIframe').appendChild(se)
      }
    },
  }

</script>
<style lang="scss">
  .modal-container {
    width: 312px;
    height: 551px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #ccc;
    overflow: hidden;
    position: fixed;
    top: 42%;
    right: 3%;
    z-index: 999;

    .modal-header {
      height: 56px;
      background: #409eff;
      color: #fff;
      display: flex;
      align-items: center;
      font-size: 14px;
      justify-content: center;
    }

    .modal-main {
      padding: 15px 15px;
    }

  }

  .phone-div {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #409eff;
    z-index: 999;
    position: absolute;
    right: 25px;
    top: 250px;

    :hover {
      opacity: 0.8;
    }

    .phone-icon {
      padding-top: 4px;
      padding-left: 5px;
      font-size: 30px;
      color: #fff;
      cursor: pointer;
    }
  }

  // #ctiIframe{
  //     width: 280px;
  //     position: fixed;
  //     right: 10px;
  //     bottom: 20px; 
  // }
  .msg-scroll {
    .el-message__content {
      max-height: 500px;
    }
  }

  //隐藏el-scrollbar底部滚动条
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  //以免隐藏el-scrollbar底部滚动条样式对下拉框产生影响
  .el-select-dropdown__wrap {
    overflow-x: scroll;
  }

  //去掉表格有时候多余横线
  body .el-table::before {
    z-index: inherit;
  }

</style>
