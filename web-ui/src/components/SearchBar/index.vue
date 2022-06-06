<template>
    <div>
        <div class="box-body baseForm">
            <el-form ref="baseForm" :model="model" :inline="true">
                <!--定义搜索栏的插槽-->
                <slot></slot>
                <el-form-item>
                    <el-button size="mini" type="success" icon="el-icon-search" @click="onSubmit">查询</el-button>
                    <!--按钮区域插槽-->
                    <slot name="buttonArea"></slot>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
                </el-form-item>
                <el-form-item v-if="hasFilter">
                    <!--<el-button size="mini" @click="collapse = !collapse" :class="{isOpen: collapse}">-->
                        <!--<i class="fa fa-filter">-->
                        <!--</i>筛选<i :class="{'el-icon&#45;&#45;right': true, 'el-icon-arrow-down': true}"></i>-->
                    <!--</el-button>-->
                </el-form-item>
            </el-form>
        </div>
        <el-collapse-transition>
            <div class="filter" v-show="collapse" v-if="hasFilter">
                <el-form ref="filterForm" :inline="true" :model="model">
                    <slot name="filter"></slot>
                </el-form>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
    import { initObj } from '@/utils/common'
    export default {
        name: 'SearchBar',
        props: {
            model: {
                type: Object,
                required: true
            },
            hasFilter: {
                type: Boolean,
                default: false,
                required: false
            },
            add: {
                type: Function
            },
            //是否展开筛选内容的标示
            flag:{
                type: Boolean,
                default: false,
            }
        },
        data () {
            return {
                collapse: true
            }
        },
        watch:{

        },
        methods: {
            onSubmit () {
                // 提交操作
                this.$emit('submit')
            },
            reset () {
                initObj(this.model);
                this.$emit('submit');
                this.$emit('resetAll')
            }
        }
    }
</script>

<style scoped lang="scss">
    .box-body{
        background-color: white;
        //padding: 20px 20px 0;
    }
    .el-icon-arrow-down {
        -webkit-transition: -webkit-transform .3s;
        transition: -webkit-transform .3s;
        transition: transform .3s;
        transition: transform .3s, -webkit-transform .3s;
        transition: transform .3s, -webkit-transform .3s;
        font-size: 12px;
    }
    .isOpen .el-icon-arrow-down {
        -webkit-transform: rotateZ(180deg);
        transform: rotateZ(180deg);
    }

</style>
<style lang="scss">
    .filter{
        background-color: white;
        ///padding-left: 20px;
        .el-form-item{
            margin-bottom: 0 !important;
        }
        .el-form-item__content{
            width: 90%;
        }
        //background-color: #e6ebf5;
    }
    .baseForm{
        .el-form-item{
            margin-right: 16px;
            margin-bottom: 10px;
        }
    }
</style>
