<template>
    <div class="main flexbox flexcolumn">
        <header>
            <div class="btl-head-fy">
                <div class="top-nav-bar">
                    <router-link class="nbar-cell active" to="/home/order">已分润</router-link>
                    <router-link class="nbar-cell" to="/home/order/nofenrun">待分润</router-link>
                </div>
            </div>
        </header>
        <div class="nav-container">
            <div class="nav-justified">
                <div class="nav-link">
                    <div class="nav-link-all">
                        <a v-for="(item, idx) in typeTabs" class="nav-cont" :class="{active: item.active}" @click="onSetCurTab(idx)">{{ item.title }}</a>
                    </div>
                </div>
                <div class="nav-search" style="display: none;"><img src="../../assets/img/icon-12.png"></div>
            </div>
        </div>
        <section class="main">
            <div class="btl-content">
                <div class="order-container" v-infinite-scroll="loadMore"
                     infinite-scroll-disabled="loading"
                     infinite-scroll-distance="150">
                    <div v-for="(item, idx) in listData" :class="{'order-list-end': item.isfinish, 'order-list-refund': !item.isfinish}" :orderstatus="item.orderStatus">
                        <div class="order-title">
                            <span class="title-type">{{ item.orderStatusText }}</span>
                            <span class="money-num-o">{{ item.subsidy }}</span>
                        </div>
                        <div class="order-info">
                            <a class="or-cell"><i>{{ item.orderType | orderTypeToName }}：</i><em>{{ item.orderAmount }}元</em></a>
                            <a class="or-cell"><i>分润时间：</i><em>{{ item.subsidyTime }}</em></a>
                            <a class="or-cell"><i>手机号码：</i><em>{{ item.mobile }}</em></a>
                            <a class="or-cell"><i>订&nbsp;单&nbsp;&nbsp;号：</i><em>{{ item.orderNum }}</em></a>
                        </div>
                    </div>
                    <div class="no-data" v-show="!listData.length">暂无数据</div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import Vue from 'vue'
    import * as types from '../../store/mutation-types'
    import { mapGetters } from 'vuex'
    import { InfiniteScroll } from 'mint-ui';
    import { Toast, MessageBox } from 'mint-ui'
    import apiButielan from '../../api/butielan'

    Vue.use(InfiniteScroll);

    const orderTypeArr = ['全部', '商城', '在线升级', '激活创客', '创客续费'];

    export default {
        data () {
            return {
                typeTabs: [
                    {
                        type: 0,
                        title: '全部',
                        active: true
                    },{
                        type: 1,
                        title: '商城',
                        active: false
                    },{
                        type: 2,
                        title: '在线升级',
                        active: false
                    },{
                        type: 3,
                        title: '激活创客',
                        active: false
                    },{
                        type: 4,
                        title: '创客续费',
                        active: false
                    }
                ],

                isAlreadyClearing: 1,
                orderType: 0,

                loading: false,
                load_finish: false,
                totalPage: 0,
                totalCount: 0,
                pageNum: 0,
                pageSize: 10,
                listData: []
            }
        },
        beforeRouteEnter (to, from, next) {
            next()
        },
        computed: {
            ...mapGetters({
                loginInfo: 'getLoginInfo'
            })
        },
        created () {
//            for(let i=0; i<15; i++){
//                let item = {
//                    mobile: '15818515514',
//                    orderType: Math.round(Math.random()*4),
//                    orderNum: 20170012342,
//                    orderAmount: 45.6,
//                    orderStatus: Math.round(Math.random()),
//                    tradingTime: '2015-12-25',
//                    subsidy: 6.7,
//                    subsidyTime: '2017-01-03'
//                };
//                item.orderStatusText = item.orderStatus == 1 ? '订单完成' : '退款';
//                this.listData.push(item)
//            }
            this.loadMore();
        },
        filters: {
            orderTypeToName (val) {
                return orderTypeArr[val];
            }
        },
        methods: {
            resetParams () {
                this.loading = false;
                this.totalPage = 0;
                this.totalCount = 0;
                this.pageNum = 0;
                this.load_finish = false;
                this.listData.splice(0, this.listData.length);
            },
            onSetCurTab (idx) {
                let me = this;
                let tab = this.typeTabs[idx];
                this.typeTabs.forEach(function (tt) {
                    tt.active = false;
                });
                tab.active = true;
                me.orderType = tab.type;
                me.resetParams();
                me.loadMore();
            },
            loadMore () {
                console.log('loadMore', Date.now());
                let me = this;
                if (me.load_finish) {
                    return;
                }
                me.loading = true;
                me.pageNum++;
                apiButielan.get_order_list({
                    params: {
                        isfenrun: me.isAlreadyClearing,
                        order_type: me.orderType,

                        pageNum: me.pageNum,
                        pageSize: me.pageSize
                    }
                }).then(function (ret) {

                    if (ret.data && ret.data.items) {
                        let list = ret.data.items;
                        list.forEach(function (item) {
                            item.orderStatusText = item.orderStatus == 2 ? '订单完成' : '退款';
                            item.isfinish = item.orderStatus == 2;
                            me.listData.push(item)
                        })
                    }
                    if (me.totalPage === 0) {
                        me.totalCount = ret.data.totalCount || 0;
                        me.totalPage = Math.ceil(me.totalCount / me.pageSize);
                    }
                    if (me.pageNum >= me.totalPage) {
                        me.load_finish = true;
                        me.loading = true;
                    } else {
                        me.loading = false;
                    }

                }, function () {
                    Toast({
                        message: '系统错误，请重试',
                        duration: 1000
                    });
                    me.loading = true;
                    me.load_finish = true;
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import '../../assets/less/already-fenyun.less';

</style>
