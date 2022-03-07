<template>
  <Dialog :title="title" :height="680" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
    <template v-slot:default>
      <!-- 分配权限内容 -->
      <div class="division-content">
        <div class="radio-box">
          <el-radio-group v-model="divisionFlag" @change="changeDivisionFlag">
            <el-radio :label="1">分发给自己</el-radio>
            <el-radio :label="2">分发给别人</el-radio>
            <el-radio :label="3">分发给片区</el-radio>
          </el-radio-group>
        </div>
        <p v-if="divisionFlag==2">可多选，多选时默认平均分配给所选择人，单选时所有订单均分配给所选择人</p>
        <p v-if="divisionFlag==3">单选，每个仅支持分发给一个片区</p>
        <el-scrollbar style="height: 350px" v-if="divisionFlag==2 || divisionFlag==3">
          <div class="tree-box" v-if="divisionFlag==2">
            <div class="left">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText">
              </el-input>
              <el-tree :data="deptOptions" :props="defaultProps" node-key="userId" show-checkbox
                :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all />
            </div>
            <!--<div class="right choise-box">-->
            <!--<el-checkbox-group v-model="chooseCheck">-->
            <!--<el-checkbox border v-for="item in userList" :key="item.userId"-->
            <!--:label="`${item.userId}+${item.deptId}`">{{item.userName}}-->
            <!--</el-checkbox>-->
            <!--</el-checkbox-group>-->
            <!--</div>-->
          </div>
          <div class="choise-box" v-if="divisionFlag==3">
            <el-radio-group v-model="chooseDeptId">
              <el-radio border v-for="item in deptList" :key="item.deptId" :label="item.deptId">
                {{item.deptName}}
              </el-radio>
            </el-radio-group>
          </div>
        </el-scrollbar>

        <el-form v-if="(divisionFlag==2 || divisionFlag==1)&& exist" ref="form" :model="form" :rules="rules"
          label-width="100px">
          <el-form-item class="custom-width" label="是否变更案件状态" prop="sfType" style="margin-bottom: 0px">
            <el-switch v-model="form.sfType" disabled active-color="#13ce66" inactive-color="#ff4949" :active-value="1"
              :inactive-value="0">
            </el-switch>
            <p style="margin-left: 10px;color: #1c84c6">（未分发案件必须开启变更案件状态）</p>
          </el-form-item>
          <el-form-item v-if="form.sfType==1" label="案件状态：" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">电话调解中</el-radio>
              <el-radio :label="7">待立案</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </Dialog>
</template>

<script>
  import Dialog from '@/components/Dialog/index'
  import {
    getToken
  } from "@/utils/auth";
  import divisionApi from "@/api/case/division/index";
  import {
    treeselect
  } from "@/api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import {
    listUser
  } from "@/api/system/user";
  import {
    listDept,
    getPid
  } from "@/api/system/dept";

  export default {
    name: "divisionDialog",
    components: {
      Dialog
    },
    props: {
      // 传参控制弹窗显示隐藏
      show: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      },
      id: {
        type: String,
        default: ''
      },
      principal: {
        type: String | Number,
        default: ''
      },
      orgNo: {
        type: String | Number,
        default: ''
      },
      caseStatus: {
        type: Array | Number,
        default: -1
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    data() {
      return {
        divisionFlag: 1,
        filterText: '',
        chooseDeptId: '',
        defaultProps: {
          children: "children",
          label: "userName",
        },
        // 部门树选项
        deptOptions: [],
        dateRange: [],
        form: {
          status: 1,
          sfType: 1
        },
        rootId: 100,
        userList: [],
        realcheckNodes: [],
        deptList: [],
        // 表单校验
        rules: {
          status: [{
            required: true,
            message: "案件状态不能为空",
            trigger: "change"
          }],
          sfType: [{
            required: true,
            message: "是否变更案件状态不能为空",
            trigger: "change"
          }]
        },
        exist: false
      }
    },
    computed: {
      dialogVisible: {
        get() {
          return this.show
        },
        set(val) {
          this.$emit('update:show', val)
        }
      }
    },
    created() {
      //   this.getList();
      this.getDeptList();
    },
    mounted() {

    },
    methods: {
      openDialog() {
        //数据初始化，首次进入
        //this.realC = [];
        this.form = {
          status: '',
          sfType: 0
        }
        this.filterText = "";
        this.chooseDeptId = '';
        this.divisionFlag = 1;
        this.exist = false;
        //整合部门数据和用户数据成一棵树
        let arr = this.deptList.concat(this.userList)
        console.log(arr);
        this.deptOptions = this.handleTree(arr, "deptId", 'parentId', 'children', this.rootId);
        if (typeof this.caseStatus == "number") {
          if (this.caseStatus == 0) {
            this.exist = true
            this.form = {
              status: 1,
              sfType: 1
            }
          }
        } else {
          this.caseStatus.forEach(item => {
            if (item == 0) {
              //存在待分发状态的案子
              this.exist = true
              this.form = {
                status: 1,
                sfType: 1
              }
            }
          })
        }
        //编辑进入,三个选项都有部门id
        // if(this.orgNo){
        //     //分发给自己
        //     if(this.userId == sessionStorage.getItem('userId')){
        //
        //     }
        // }
      },
      // 提交上传文件
      submit() {
        if (this.divisionFlag == 2) {
          //console.log(this.$refs.tree.getCheckedNodes());
          let checkNodes = this.$refs.tree.getCheckedNodes() || []
          if (checkNodes.length == 0) {
            this.msgError('请选择用户');
            return
          }
          this.realcheckNodes = checkNodes.filter(res => {
            return res.userId
          })
          //console.log(realcheckNodes)
        }
        if (this.divisionFlag == 3) {
          this.form.sfType = 0
          this.form.status = ''
          if (this.chooseDeptId == '') {
            this.msgError('请选择片区')
            return
          }
        }
        let userIds = [];
        let deptIds = [];
        let noData = [];
        console.log(this.realcheckNodes);
        this.realcheckNodes.forEach(item => {
          if (item.parentId != this.realcheckNodes[0].parentId) {
            noData.push(item.parentId)
          }
          userIds.push(item.userId);
          deptIds.push(item.parentId)
        })
        let param = {
          type: this.divisionFlag,
          status: this.form.status,
          sfType: this.form.sfType,
          deptId: this.chooseDeptId,
          ids: this.id, //案件ids，多个用','分隔
          userIds: userIds.join(','), //userIds,多个用','分隔
          deptIds: deptIds.join(','), //deptIds,多个用','分隔
        }
        if (noData.length > 0) {
          this.msgError('不能跨区分发')
          return
        }
        if (this.divisionFlag == 2 && this.id.split(',').length < userIds.length) {
          this.msgError('选择的用户个数不能超过案件个数')
          return
        }
        divisionApi.division(param).then(res => {
          if (res.code == 200) {
            this.dialogVisible = false
            this.msgSuccess('操作成功')
            this.$emit('refresh')
          }
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.userName.indexOf(value) !== -1;
      },
      changeDivisionFlag(value) {
        //console.log(value)
        if (value == 1) {
          this.realcheckNodes = [];
          this.chooseDeptId = ''
        }
        if (value == 2) {
          this.chooseDeptId = ''
        }
        if (value == 3) {
          this.realcheckNodes = []
        }
      },
      checkChange(node) {
        console.log(node)
      },
      handleNodeClick(data) {
        //this.getList();
      },
      /** 查询用户列表 */
      getList() {
        // let queryParams = {
        //     pageNum: 1,
        //     pageSize: 10,
        //     userName: undefined,
        //     phonenumber: undefined,
        //     status: undefined,
        //     deptId: 101,
        // }
        // listUser(this.addDateRange(queryParams, this.dateRange)).then(
        //     (response) => {
        //         //console.log(response)
        //         this.userList = response.rows || []
        //         for (var i = 0; i < this.userList.length; i++) {
        //             this.userList[i].parentId = this.userList[i].deptId
        //             delete this.userList[i].deptId
        //         }
        //     }
        // );
        // divisionApi.userList().then(
        //   (response) => {
        //     this.userList = response.data || []
        //     for (var i = 0; i < this.userList.length; i++) {
        //       this.userList[i].parentId = this.userList[i].deptId
        //       delete this.userList[i].deptId
        //     }
        //   }
        // );
      },
      /** 查询部门列表 */
      getDeptList() {
        // let param = {
        //     parentId: 100
        // };
        // listDept(param).then(response => {
        //     this.deptList = response.data || [];
        //     for (var j = 0; j < this.deptList.length; j++) {
        //         this.deptList[j].userName = this.deptList[j].deptName
        //     }
        // });
        //获取rootid
        divisionApi.userList().then(response => {
          this.rootId = response.data.pid;
          this.deptList = response.data.deptList || [];
          for (var j = 0; j < this.deptList.length; j++) {
            this.deptList[j].userName = this.deptList[j].deptName
          }
          this.userList = response.data.userList || []
          for (var i = 0; i < this.userList.length; i++) {
            this.userList[i].parentId = this.userList[i].deptId
            delete this.userList[i].deptId
          }
        });
      },
    }
  }

</script>

<style scoped lang="scss">
  .el-dialog__body {
    height: 20px;
  }

  .division-content {
    .radio-box {
      margin: 10px 0 14px;
    }

    >p {
      font-size: 12px;
      color: #1c84c6;
      margin-bottom: 22px;
    }

    .choise-box {
      display: flex;

      .el-radio,
      .el-checkbox {
        justify-content: space-between;
        margin: 0 10px 10px 0;
      }

    }

    .tree-box {
      border: 1px solid #e6ebf5;
      padding: 10px;
    }

    /*自定义横向滚动条*/
    ::-webkit-scrollbar {
      background-color: transparent;
    }
  }

</style>
<style lang="scss">
  .custom-width {
    .el-form-item__label {
      width: 170px !important;
      text-align: left;
    }

    .el-form-item__content {
      display: flex;
      align-items: center;
    }
  }

</style>
