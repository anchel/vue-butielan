<template>
    <div class="full-mask flexbox flexcolumn">
        <top-nav-small :title="title"></top-nav-small>
        <section class="main">
            <div class="btl-content">
                <div class="order-container" v-infinite-scroll="loadMore"
                     infinite-scroll-disabled="loading"
                     infinite-scroll-distance="150">
                    <div v-for="(item, idx) in listData" :class="{'order-list-end': item.orderStatus, 'order-list-refund': !item.orderStatus}" :orderstatus="item.orderStatus">
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
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import * as types from '../../store/mutation-types'
    import { InfiniteScroll } from 'mint-ui';
    import { Toast, MessageBox } from 'mint-ui'
    import apiButielan from '../../api/butielan'

    Vue.use(InfiniteScroll);

    const orderTypeArr = ['全部', '商城', '在线升级', '激活创客', '创客续费'];

    export default {
        data () {
            return {
                title: '月结收益订单列表',

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
            next((vm) => {
                vm.$store.commit('changeShowBottomNav', false);
            })
        },
        beforeRouteLeave (to, from, next) {
            this.$store.commit('changeShowBottomNav', true);
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
                        requestUserId: me.$route.query.userid,
                        beginDate: me.$route.query.beginDate,
                        endDate: me.$route.query.endDate,
                        isAlreadyClearing: me.isAlreadyClearing,
                        orderType: me.orderType,
                        pageNum: me.pageNum,
                        pageSize: me.pageSize
                    }
                }).then(function (ret) {
                    ret.data = ret.data || {};
                    if (ret.data && ret.data.items) {
                        let list = ret.data.items;
                        list.forEach(function (item) {
                            item.orderStatusText = item.orderStatus == 1 ? '订单完成' : '退款';
                            me.listData.push(item)
                        })
                    }
                    if (me.totalPage === 0) {
                        me.totalCount = ret.data.totalCount || 0;
                        me.totalPage = Math.ceil(me.totalCount / me.pageSize);
                    }
                    if (me.pageNum >= me.totalPage) {
                        me.loading = true;
                        me.load_finish = true;
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
    @import '../../assets/less/seeorder.less';

</style>
