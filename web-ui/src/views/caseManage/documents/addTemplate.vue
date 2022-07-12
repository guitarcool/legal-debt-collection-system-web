<template>
    <div>
        <Dialog :title="title" :height="600" :show.sync="dialogVisible" width="60%" @openDialog="openDialog">
            <template v-slot:default>
                <div class="add-template">
                    <p>基本信息</p>
                    <el-form ref="form" class="custom-display" :model="form" :rules="rules" label-width="100px">
                        <el-form-item label="模版号：">
                            <el-input v-model="form.id" disabled placeholder="模版号后台自动生成"></el-input>
                        </el-form-item>
                        <el-form-item label="模版名称：" prop="name">
                            <el-input v-model="form.name" placeholder="请输入模版名称"></el-input>
                        </el-form-item>
                        <el-form-item label="管理员：">
                            <el-select v-model="form.manager" filterable @change="changeUser" placeholder="请选择">
                                <el-option v-for="item in userList" :key="item.userId" :label="item.nickName"
                                    :value="item.userId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="模版类别：" prop="templateType">
                            <el-select filterable v-model="form.templateType" placeholder="请选择">
                                <el-option v-for="item in templateTypes" :key="item.dictValue" :label="item.dictLabel"
                                    :value="item.dictValue">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="form.templateType" label="格式类型：" prop="formatType">
                            <el-select @change="handleChange" filterable v-model="form.formatType" placeholder="请选择">
                                <el-option v-for="item in formatTypes" :key="item.dictValue" :label="item.dictLabel"
                                    :value="item.dictValue">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="add-template"
                    v-if="Number(form.formatType)===1||Number(form.formatType)===2||Number(form.formatType)===3">
                    <p>正文</p>
                    <el-form ref="form" style="position: relative" :model="form" :rules="rules" label-width="100px">
                        <el-form-item prop="content" class="move-left">
                            <el-input v-if="Number(form.formatType)===1||Number(form.formatType)===2" @input="getVal"
                                v-model="form.content" :rows="8" type="textarea"
                                placeholder="请在框内编辑模版，用“${字段英文名}”表示需要映射的字段，可点击“查看字段表”查看字段"></el-input>
                            <el-input v-if="Number(form.formatType)===3" @input="getVal" v-model="form.content"
                                :rows="8" type="textarea"
                                placeholder="1、 请在框内编辑模版，用“${字段英文名}”表示需要映射的字段，可点击“查看字段表”查看字段。若模版中需要包含文书pdf查看地址，可用${network address}代替；">
                            </el-input>
                        </el-form-item>
                        <p class="font-number">{{fontNumber}}字</p>
                    </el-form>
                </div>
                <!--状态设置-->
                <div class="add-template">
                    <p>状态设置</p>
                    <el-form ref="form" class="custom-display" :model="form" :rules="rules" label-width="130px">
                        <el-form-item label="是否为公共模版：">
                            <el-radio-group v-model="form.isPublic">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="0">否，区域模版</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <!--<el-input v-model="form.deptId" placeholder="请输入启用地区"></el-input>-->
                        <el-form-item v-if="form.isPublic==0" label="启用地区：">
                            <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true"
                                placeholder="请选择启用地区" />
                        </el-form-item>
                        <el-form-item label="模版状态：">
                            <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949"
                                :active-value="1" :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="子模版循环：" v-if="form.formatType!=''&&Number(form.formatType)===4">
                            <el-switch v-model="form.isSubLoop" active-color="#13ce66" inactive-color="#ff4949"
                                :active-value="1" :inactive-value="0">
                            </el-switch>
                            <p style="font-size:12px;">提示：子模版循环开启后本母模版内所有的证据材料将进行循环</p>
                        </el-form-item>
                    </el-form>
                </div>
                <!--上传模版-->
                <div class="add-template"
                    v-if="form.formatType!=''&&(Number(form.formatType)===0||Number(form.formatType)===4)">
                    <p>选择/上传需要的加入的内容</p>
                    <el-row v-if="!id||title=='克隆模版'" :gutter="20">
                        <el-col :span="12">
                            <el-form ref="form" :model="form" :rules="rules" label-width="130px">
                                <el-form-item class="move-left">
                                    <el-upload class="upload-demo covered-with" action="string"
                                        :http-request="handleUplod" accept=".docx, .doc" :disabled="isUploading"
                                        :on-change="fileOnChange" drag :show-file-list="false" :file-list="fileList">
                                        <i class="el-icon-upload"></i>
                                        <div class="el-upload__text">
                                            将文件拖到此处，或
                                            <em>点击上传</em>
                                        </div>
                                        <div v-if="form.formatType == 4||form.formatType == 0" class="el-upload__tip"
                                            style="color:red" slot="tip">
                                            提示：1、可上传多个.docx文档，编辑时用"${字段英文名}”表示需要映射的字段或图片，可点击“查看字段表”查看字段名；2、需要循环的映射多个案件的内容，请在句子开头插入循环标识“$$[”，句子结束插入标识“]$$”，句子内容可以为一般映射设定内容，以“${字段英文名}$”代表需要映射的具体案件内容；3、涉及编号时，以${No1}表示“1”形式，以${No2}表示“一”形式。
                                        </div>
                                        <div v-else class="el-upload__tip" style="color:red" slot="tip">
                                            提示：可上传多个.docx文档，编辑时用"${字段英文名}”表示需要映射的字段或图片，可点击“查看字段表”查看字段名
                                        </div>
                                    </el-upload>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :span="12"
                            v-if="(form.formatType!=''&&Number(form.formatType)===0)||(form.formatType!=''&&Number(form.formatType)==4&&form.isSubLoop == 1)">
                            <!--<p class="book-title">勾选您所需要加入的证据包信息：</p>-->
                            <el-input clearable placeholder="输入关键字进行过滤" v-model="filterText">
                            </el-input>
                            <el-tree style="overflow-y: auto;height: 300px;" :data="templateData"
                                class="border-style-custom" node-key="id" :expand-on-click-node="false"
                                :filter-node-method="filterNode" ref="tree" @node-click="handleNodeClick"
                                default-expand-all />
                        </el-col>
                    </el-row>
                    <!--电子签章信息-->
                    <div>
                        <div class="add-template" v-if="['0', '4'].includes(form.formatType)">
                            <p
                                v-if="(title=='新增模版'&&draggableList.length!=0)||(title=='克隆模版'&&draggableList.length!=0)">
                                电子签章设置</p>
                            <el-button style="margin-bottom:10px" size="mini" v-if="id&&title=='编辑模版'" type="primary"
                                @click="addFile">新增</el-button>
                            <p v-if="id&&title=='编辑模版'">电子签章设置</p>
                            <div v-if="draggableList.length!=0" class="el-upload__tip" style="color:red" slot="tip">
                                若选择“有电子签章”，则需必填所有电子签章设置信息</div>
                        </div>
                        <ul class="drag-box" ref="parentNode">
                            <div v-if="draggableList.length==0" style="line-height: 50px;text-align: center">暂无数据</div>
                            <draggable v-model="draggableList" v-else>
                                <transition-group>
                                    <li v-for="(item,index) in draggableList" :key="index+1" class="item"
                                        style="height:auto;display:flex;flex-direction: column;padding: 5px;">
                                        <div style="width:100%;display:flex;align-items: center;margin: 10px 0;">
                                            <p style="width:50%;font-size:16px;font-weight:700;color:#000;">
                                                {{item.label}}</p>
                                            <div style="width:50%;display:flex;justify-content: flex-end;">
                                                <div>
                                                    <i v-if="!id||title=='克隆模版'" class="el-icon-s-operation"
                                                        style="margin-right: 20px"></i>
                                                    <i class="el-icon-delete" @click="deleteData(item,index)"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <el-form class="model_form" ref="isSignform" :model="isSignform">
                                            <el-form-item style="width:33%" label="有无签章:">
                                                <el-select v-model="item.isSign" filterable @change="isSignchange(item)"
                                                    placeholder="请选择">
                                                    <el-option v-for="item in isSignOptions" :key="item.dictValue"
                                                        :label="item.dictLabel" :value="item.dictValue">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item style="width:33%" label="签章名称:" prop="signId"
                                                v-if="item.isSign!=0">
                                                <el-select clearable v-model="item.signId" filterable
                                                    placeholder="请选择">
                                                    <el-option v-for="item in signNameOptions" :key="item.dictValue"
                                                        :label="item.dictLabel" :value="item.dictValue">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item style="width:33%" label="签章设定:" prop="signSetUp"
                                                v-if="item.isSign!=0&&item.type==1">
                                                <el-select clearable v-model="item.signSetUp" filterable
                                                    placeholder="请选择">
                                                    <el-option v-for="item in signSetUpOptions" :key="item.dictValue"
                                                        :label="item.dictLabel" :value="item.dictValue">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <!-- 如果是证据包 -->
                                            <el-form-item style="width:33%" label="签章设定:" prop="signSetUp"
                                                v-if="item.isSign!=0&&item.type==2">
                                                <el-select clearable v-model="item.signSetUp" filterable
                                                    placeholder="请选择">
                                                    <el-option v-for="item in options5" :key="item.value"
                                                        :label="item.label" :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-form>
                                        <el-form class="model_form" ref="isSignform" :model="isSignform">
                                            <el-form-item style="width:33%" label="指定位置:" prop="pagePlace"
                                                v-if="item.isSign!=0&&item.signSetUp==2">
                                                <el-select clearable filterable v-model="item.pagePlace"
                                                    placeholder="请选择">
                                                    <el-option v-for="item in pagePlaceOptions" :key="item.dictValue"
                                                        :label="item.dictLabel" :value="item.dictValue">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item style="width:33%" label="指定页面:" prop="pageIndex"
                                                v-if="item.isSign!=0&&item.signSetUp==2">
                                                <el-select clearable filterable v-model="item.pageIndex"
                                                    placeholder="请选择">
                                                    <el-option v-for="item in pageIndexOptions" :key="item.value"
                                                        :label="item.label" :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item style="width:26%" label="" prop="placeContent"
                                                v-if="item.isSign!=0&&item.signSetUp ==1">
                                                <el-input clearable v-model="item.placeContent"
                                                    placeholder="请输入关键字，用逗号分隔多个关键字。"></el-input>
                                            </el-form-item>
                                            <el-form-item style="width:26%" label="" prop="pageRange"
                                                v-if="item.isSign!=0&&item.signSetUp ==2&&item.pageIndex==''">
                                                <el-input clearable v-model="item.pageRange"
                                                    placeholder="请输入页码或用逗号分隔的页面范围。"></el-input>
                                            </el-form-item>
                                        </el-form>
                                    </li>
                                </transition-group>
                            </draggable>
                        </ul>
                    </div>
                </div>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submit">确 定</el-button>
            </div>
        </Dialog>
        <editTemplate :title="editData.title" :show.sync="editData.dialogVisible" :id="editData.id"
            :type="editData.type" :tid="editData.tid" @refresh="refresh" :singleData="editData.singleData">
        </editTemplate>
    </div>
</template>

<script>
    import Dialog from '@/components/Dialog/index'
    import {
        getToken
    } from "@/utils/auth";
    import templateApi from "@/api/case/document/templateIndex";
    import editTemplate from './editTemplate'
    import axios from 'axios'
    import temCenterApi from '@/api/case/temCenterFile/index'
    import {
        treeselect
    } from "@/api/system/dept";
    import Treeselect from "@riophae/vue-treeselect";
    import "@riophae/vue-treeselect/dist/vue-treeselect.css";
    import {
        addGetUsers
    } from "@/api/system/role";
    import draggable from 'vuedraggable'

    export default {
        //多元调解成功
        name: "addTemplate",
        components: {
            Dialog,
            editTemplate,
            Treeselect,
            draggable
        },
        data() {
            return {
                form: {
                    templateNumber: '',
                    name: '',
                    version: '',
                    manager: '',
                    deptId: null,
                    templateType: '',
                    formatType: '',
                    isPublic: 1,
                    status: 1,
                    content: '',
                    file: ''
                },
                isSignOptions: [],
                signNameOptions: [], //签章名称
                signSetUpOptions: [], //签章设定
                options5: [{
                    value: '2',
                    label: '指定位置定位'
                }, ], //签章设定
                isSignform: {},
                pagePlaceOptions: [], //签章位置
                pageIndexOptions: [{
                        value: 'All',
                        label: '所有页'
                    },
                    {
                        value: '',
                        label: '指定页'
                    }
                ], //签章位置
                rules: {
                    name: [{
                        required: true,
                        message: '请输入模版名称',
                        trigger: 'blur'
                    }],
                    templateType: [{
                        required: true,
                        message: '请选择模版类别',
                        trigger: 'blur'
                    }],
                    formatType: [{
                        required: true,
                        message: '请选择格式类型',
                        trigger: 'blur'
                    }],
                    manager: [{
                        required: true,
                        message: '请选择管理员',
                        trigger: 'blur'
                    }],
                    signId: [{
                        required: true,
                        message: '请选择签章名称',
                        trigger: 'blur'
                    }],
                    signSetUp: [{
                        required: true,
                        message: '请选择签章设定',
                        trigger: 'blur'
                    }]
                },
                templateTypes: [], //模版类别
                formatTypes: [], //格式类型
                signatureOptions: [],
                // 是否禁用上传
                isUploading: false,
                fileList: [],
                sinMap: new Map(),
                userList: [],
                // 部门树选项
                deptOptions: undefined,
                userIds: [],
                draggableList: [],
                filterText: '',
                templateData: [],
                editData: {
                    title: '',
                    dialogVisible: false,
                    id: '',
                    type: 3,
                    tid: '',
                    singleData: ''
                },
                fontNumber: 0,
                submitLoading: false
            }
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
            //新增模版获取管理员
            this.getUsers();
            //模版类别
            this.getDicts("template_type").then((response) => {
                this.templateTypes = response.data;
            });
            //格式类型
            this.getDicts("format_type").then((response) => {
                this.formatTypes = response.data;
            });
            //有无电子签章
            this.getDicts("isSign").then((response) => {
                this.isSignOptions = response.data;
            });
            //签章设定类别
            this.getDicts("signSetUp").then((response) => {
                this.signSetUpOptions = response.data;
            });
            //指定页面位置类别
            this.getDicts("pagePlace").then((response) => {
                this.pagePlaceOptions = response.data;
            });
            //签章名称
            this.getDicts("signName").then((response) => {
                this.signNameOptions = response.data;
            });
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            refresh() {
                this.openDialog()
            },
            isSignchange(item) {
                if (item.isSign == 0 && item.type == 2) {
                    item.signId = '';
                    item.signSetUp = '';
                    item.pagePlace = '';
                    item.pagePlace = '';
                    item.pageIndex = 'All';
                    item.pageRange = '';
                    return item
                } else if (item.isSign == 0 && item.type == 1) {
                    item.signId = '';
                    item.signSetUp = '';
                    item.pagePlace = '';
                    item.placeContent = '';
                    item.pageIndex = 'All';
                    item.pageRange = '';
                    return item
                }
            },
            openDialog() {
                //新增初始化数据
                // initObj(this.form);
                this.form = {
                    templateNumber: '',
                    name: '',
                    version: '',
                    manager: '',
                    templateType: '',
                    formatType: '',
                    isPublic: 1,
                    status: 1,
                    content: '',
                    file: null,
                    deptId: null,
                    list: [],
                    managerId: null,
                    isSubLoop: 0
                }
                this.filterText = "";
                this.draggableList = [];
                this.fileList = []
                this.resetAddForm();
                this.form.id = this.id;
                this.form.isPublic = 1;
                this.form.status = 1;
                this.getDeptList();
                this.getEvidenceField();
                //编辑查详情
                if (this.id) {
                    templateApi.info(this.id).then(res => {
                        this.form = res.data
                        this.form.templateType = this.form.templateType.toString()
                        this.form.formatType = this.form.formatType.toString()
                        this.managerId = null;
                        if (this.form.manager) {
                            if (this.userList.some(tag => tag.userId == this.form.manager)) {
                                this.form.manager = Number(this.form.manager)
                            } else {
                                this.managerId = Number(this.form.manager);
                                this.form.manager = this.form.managerName;
                            }
                        }
                        if (this.form.deptId) {
                            this.form.deptId = Number(this.form.deptId)
                        }
                        //文件信息
                        if (this.form.templateFileList && this.form.templateFileList.length) {
                            for (var i = 0; i < this.form.templateFileList.length; i++) {
                                this.form.templateFileList[i].label = this.form.templateFileList[i].fileName !=
                                    null ? this.form
                                    .templateFileList[i].fileName : this.form.templateFileList[i].pdfName
                            }
                        }
                        this.draggableList = this.form.templateFileList || []
                        if (this.title == '克隆模版') {
                            this.form.templateNumber = ''
                            this.draggableList = []
                        }
                    })
                }
            },
            //重置表单清除验证
            resetAddForm() {
                try {
                    this.$refs['form'].resetFields()
                } catch (e) {

                }
            },
            submit() {
                if (!this.form.name) {
                    this.msgError('请填写模版名称')
                    return
                }
                this.submitLoading = true;
                let formData = new FormData();
                formData.append("templateNumber", this.form.templateNumber);
                if (this.form.file != null) {
                    formData.append("file", this.form.file);
                }
                formData.append("id", this.id);
                formData.append("name", this.form.name);
                formData.append("version", this.form.version);
                formData.append("manager", this.managerId ? this.managerId : this.form.manager);
                formData.append("templateType", this.form.templateType);
                formData.append("formatType", this.form.formatType);
                formData.append("isPublic", this.form.isPublic);
                formData.append("deptId", this.form.deptId ? this.form.deptId : null);
                formData.append("status", this.form.status);
                formData.append("content", this.form.content);
                formData.append("isSubLoop", this.form.isSubLoop);
                this.draggableList.forEach((item, i) => {
                    formData.append(`list[${i}].type`, item.type);
                    formData.append(`list[${i}].id`, item.id ? item.id : '');
                    if (item.file != null) {
                        formData.append(`list[${i}].file`, item.file);
                    }
                    formData.append(`list[${i}].pdfName`, item.pdfName);
                    //电子签章内容
                    formData.append(`list[${i}].isSign`, item.isSign ? item.isSign : '');
                    formData.append(`list[${i}].pagePlace`, item.pagePlace ? item.pagePlace : '');
                    formData.append(`list[${i}].signId`, item.signId ? item.signId : '');
                    formData.append(`list[${i}].signSetUp`, item.signSetUp ? item.signSetUp : '');
                    if (item.signSetUp == 2 && item.pageIndex == "All") {
                        formData.append(`list[${i}].pageRange`, "All");
                    } else if (item.signSetUp == 2 && item.pageIndex != "All") {
                        formData.append(`list[${i}].pageRange`, item.pageRange ? item.pageRange : '');
                    } else if (item.signSetUp == 1) {
                        formData.append(`list[${i}].placeContent`, item.placeContent ? item.placeContent : '');
                    }
                })
                //return
                const instance = axios.create({
                    withCredentials: true
                });
                instance.defaults.headers.common['Authorization'] = 'Bearer ' + getToken()
                var that = this
                //判断是编辑还是克隆,默认是新增url
                var url = '/template/info';
                if (this.title == '编辑模版') {
                    url = '/template/info/edit'
                }
                instance({
                    method: 'post',
                    url: process.env.VUE_APP_BASE_API + url,
                    data: formData,
                    timeout: 600000,
                    processData: false, // 告诉axios不要去处理发送的数据(重要参数)
                    contentType: false, // 告诉axios不要去设置Content-Type请求头
                    // config: {
                    //     headers: {'Content-Type': 'multipart/form-data'}
                    // }
                }).then(function (response) {
                    if (response.data.code == 200) {
                        that.msgSuccess(response.data.msg);
                        that.submitLoading = false;
                        that.dialogVisible = false;
                        that.$emit('refresh');
                    } else {
                        that.submitLoading = false;
                        that.msgError(response.data.msg);
                    }
                }).catch(error => {
                    that.submitLoading = false;
                    that.msgError(error);
                })
            },
            //转变格式类型
            handleChange(value) {
                if (this.title == '新增模版' || this.title == '克隆模版') {
                    this.draggableList = [];
                }
            },
            fileOnChange(file) {
                this.isUploading = false;
                let param = {
                    file: file.raw,
                    type: 1,
                    pdfName: '',
                    label: file.name,
                    isSign: '0',
                    pageIndex: 'All',
                };
                this.draggableList.push(param);
            },
            //新增模版获取管理员
            getUsers() {
                let param = {
                    roleKey: 'wenshuguanliyuan'
                }
                addGetUsers(param).then(response => {
                    this.userList = response.data || []
                })

            },
            /** 查询部门列表 */
            getDeptList() {
                treeselect().then((response) => {
                    this.deptOptions = response.data;
                });
            },
            //查询证据包信息
            getEvidenceField() {
                templateApi.getEvidenceField().then((response) => {
                    this.templateData = [response.data];
                });
            },
            //切换管理员
            changeUser(value) {
                this.managerId = null;
                this.form.deptId = null;
                this.deptOptions = undefined;
                temCenterApi.findByUsername(value).then(response => {
                    this.deptOptions = response.data;
                })
            },
            handleUplod() {},
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            handleNodeClick(data) {
                if (!data.value) {
                    this.msgError('请正确选择模版')
                } else {
                    let param = {
                        file: null,
                        type: 2,
                        pdfName: data.label,
                        label: data.label,
                        id: data.value,
                        isSign: '0',
                        pageIndex: 'All',
                    };
                    this.draggableList.push(param);
                }
            },
            deleteData(item, index) {
                if (this.id) {
                    var that = this
                    this.$confirm(`此操作连接数据库，是否继续?`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        closeOnClickModal: false,
                        type: "warning",
                    }).then(() => {
                        temCenterApi.deleteFile(item.id).then(res => {
                            that.msgSuccess(res.msg);
                            that.openDialog()
                            that.draggableList.splice(index, 1)
                        })
                    }).catch(() => {
                        that.msgInfo("已取消操作");
                    })
                } else {
                    this.draggableList.splice(index, 1)
                }
            },
            addFile() {
                this.editData.title = '新增选择文件';
                this.editData.dialogVisible = true;
                //type == 1 上传文件，type == 2 证据包， type == 3 自定义type 代表二者都可选。
                if (this.form.formatType == 4 && this.form.isSubLoop == 0) {
                    this.editData.type = 1;
                } else {
                    this.editData.type = 3;
                }
                this.editData.id = '';
                this.editData.tid = this.id;
            },
            getVal(value) {
                this.fontNumber = value.length
            },
            // //切换指定页面
            // changePageIndex(item) {
            //     if (item.pageIndex == 'All') {
            //         item.pageRange = 'All';
            //         return item
            //     }
            // }
        }
    }

</script>

<style scoped>
    .el-dialog__body {
        height: 20px;
    }

</style>
<style lang="scss">
    .add-template {
        .sig-style {
            width: 100%;
        }

        .model_form {
            width: 100%;
            display: flex;
            align-items: center;
            margin-top: 10px;

            .el-form-item {
                margin-bottom: 10px;
            }
        }

        .custom-display {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .el-form-item {
                width: 48%;
                /*.el-form-item__label{*/
                /*text-align: left;*/
                /*}*/
            }
        }

        .more_little {
            position: absolute;
            right: 36%;
            bottom: 30px;
            font-size: 30px;
            color: #409EFF;
        }

        .font-big i {
            font-size: 30px;
            margin-right: 20px;
            color: #409EFF;
        }
    }

    .add-template {
        >p {
            padding: 0px 0 10px 16px;
            color: #409EFF;
            font-size: 16px;
            position: relative;
            font-weight: bold;
        }

        >p::before {
            position: absolute;
            top: 4px;
            left: 0;
            content: '';
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background-color: #409EFF;
        }

        .el-upload__tip {
            line-height: 16px;
        }
    }

    .move-left {
        .el-form-item__content {
            margin-left: 0 !important;
        }
    }

    .border-style-custom {
        border: 1px solid #e6ebf5;
        padding: 10px;
        min-height: 190px;
        border-top: none;
        border-radius: 4px;

        .el-tree-node.is-current>.el-tree-node__content {
            color: #409eff;
            background-color: transparent;
            border-radius: 4px;
        }

        .el-tree-node>.el-tree-node__content:hover {
            background-color: transparent;
        }

        .el-tree-node.is-current>.el-tree-node__content:after {
            content: "\e6da";
            font-family: element-icons !important;
            padding-left: 10px;
            font-weight: bolder;
        }

        .el-tree-node>.el-tree-node__children {
            overflow: unset;
        }
    }

    .book-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #409EFF;
    }

    .drag-box {
        border: 1px solid #e6ebf5;
        margin: 10px 0;
        padding: 10px;
        min-height: 50px;

        li {
            list-style: none;
            height: 30px;
            border-bottom: 1px solid #f3eeee;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;

            p:first-of-type {
                width: 50%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        li:last-of-type {
            border-bottom: none;
        }
    }

    .font-number {
        position: absolute;
        bottom: -20px;
        right: 2px;
        color: #999999;
    }

</style>
