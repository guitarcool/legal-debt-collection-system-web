<template>
    <div id="app">
        <router-view />
        <transition name="el-zoom-in-center">
            <div
                v-show="isRole && !open"
                v-drag
                class="modal-container"
                style="cursor: move;transform: translate(16px, -80px);"
            >
                <i
                    class="el-icon-circle-close"
                    style="cursor: pointer;color:#fff;font-size:18px;position: absolute;right:5px;top:5px"
                    @click="openctiIframe"
                ></i>
                <div class="modal-header">
                    <p>度言</p>
                </div>
                <!-- <div>
                  <el-button type="success" plain @click="gorouter">成功按钮</el-button>
                </div> -->
                <div id="ctiIframe" class="modal-main"></div>
            </div>
        </transition>
        <transition name="el-zoom-in-center">
            <div class="phone-div" v-show="isRole && open">
                <i
                    class="el-icon-s-custom phone-icon"
                    @click="openctiIframe"
                ></i>
            </div>
        </transition>
    </div>
</template>

<script>
import indexApi from "@/api/index";
import merge from "webpack-merge";
export default {
    name: "App",
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
                pageSize: 50
            }
        };
    },
    watch: {
        $route(to, from) {
            if (from.path == "/login") {
                this.getList();
            } else if (from.path == "/" && to.path != "/login") {
                this.getList();
            }
        }
    },
    //注册局部组件指令
    directives: {
        drag: function(el) {
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
            this.open = !this.open;
        },
        //浏览器关闭或刷新事件
        bindCloseBrowser() {
            var a =
                "注意！！\n您即将离开页面！离开后可能会导致数据丢失\n\n您确定要离开吗？";
            window.onbeforeunload = function(b) {
                b = b || window.event;
                b.returnValue = a;
                return a;
            };
        },
        // gorouter(){
        //     let id = 0;
        //     ++id;
        //     console.log(id);
        //     this.$router.push({
        //         path: `/division/cutBeforeDetails/${id}`,
        //         query: {
        //             beforeId: id
        //         }
        //     });
        // },
        /** 查询token */
        getList() {
            let accountId = JSON.parse(sessionStorage.getItem("accountId"));
            if (accountId) {
                this.accountId = accountId;
                indexApi.initBreathe(accountId).then(response => {
                    if (response.data != 0) {
                        sessionStorage.setItem(
                            "token",
                            JSON.stringify(response.data)
                        );
                        this.token = response.data;
                        this.isRole = true;
                        this.getIframe();
                    } else {
                        sessionStorage.setItem(
                            "token",
                            JSON.stringify(response.data)
                        );
                    }
                });
            } else {
                this.isRole = null;
                sessionStorage.setItem("token", JSON.stringify(0));
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
            var logData = {};
            var se = document.createElement("script");
            se.id = "dySdkScript";
            se.setAttribute(
                "url",
                `https://cti.duyansoft.com?account_id=${this.accountId}&token=${this.token}&noNumberInput=false&noOpBtn=false`
            );
            se.setAttribute("width", "280");
            se.setAttribute("height", "460");
            se.src = "https://cti.duyansoft.com/syui/dysdk/dysdk2.min.js";

            // js 加载后执行
            se.onload = () => {
                //初始化完毕
                DYSDK.ready(() => {
                    // console.log(111)
                });

                DYSDK.callReady(() => {
                    // console.log(222)
                });
                //电话连接中状态
                DYSDK.callConnecting(data => {});
                //电话成功状态
                DYSDK.callConfirm(data => {
                    if (!data.uuid) {
                        this.$Message.error("不存在uuid");
                        return;
                    }
                    //电话成功日志
                    if (data) {
                        logData = data;
                    }
                    indexApi.breatheLog(logData).then(res => {});
                });
                //电话失败
                DYSDK.callFail(data => {
                    //电话失败日志
                    if (data) {
                        logData = data;
                    }
                    indexApi.breatheLog(logData).then(res => {});
                });
                //电话挂断
                DYSDK.callEnd(data => {
                    //电话挂断日志
                    if (data) {
                        logData = data;
                    }
                    indexApi.breatheLog(logData).then(res => {});
                });
                //处于预测式智能外呼状态
                DYSDK.callBridge(data => {
                    //电话预测式智能外呼日志
                    if (data) {
                        logData = data;
                    }
                    indexApi.breatheLog(logData).then(res => {});
                    console.log(data, "打印结果");
                    if (data.bridgeType == "start") {
                        let result = data.userTag.split("+");
                        let id = result[0];
                        let name = result[1];
                        console.log(id, name);
                        if (name == "cutBeforeInfo") {
                            // if (this.$route.name == 'cutBeforeInfo') {
                            //     //新增或修改单个参数
                            //     this.$router.replace({
                            //         query: merge(this.$route.query, {
                            //             beforeId: id
                            //         })
                            //     })
                            // }
                            this.$router.push({
                                path: `/division/cutBeforeDetails/${id}`,
                                query: {
                                    beforeId: id
                                }
                            });
                        } else if (name == "cutAfterInfo") {
                            // if (this.$route.name == 'cutAfterInfo') {
                            //     //新增或修改单个参数
                            //     this.$router.replace({
                            //         query: merge(this.$route.query, {
                            //             afterId: id
                            //         })
                            //     })
                            // }
                            this.$router.push({
                                path: `/division/cutAfterDetails/${id}`,
                                query: {
                                    afterId: id
                                }
                            });
                        }
                    }
                });

                DYSDK.getPhonelines(data => {
                    if (data) {
                        this.isCallReady = true;
                    }
                });
                //CTI退出登录
                DYSDK.ctiLogout(data => {
                    this.$message.success("外呼平台已退出，请按需重新登陆");
                });
                DYSDK.init();
            };
            document.getElementById("ctiIframe").appendChild(se);
        }
    }
};
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
