<template>
    <div class="main flexbox flexcolumn">
        <header>
            <div class="btl-head-fy">
                <top-back-image :url="backUrl"></top-back-image>
                <div class="top-nav-bar">
                    <router-link class="nbar-cell active" to="/home/tongji/membercard">已激活</router-link>
                    <router-link class="nbar-cell" to="/home/tongji/membercard/daijihuolist">待激活</router-link>
                </div>
            </div>
        </header>
        <section class="main">
            <div class="btl-content" style="">
                <!--<Scroller delegate-id="myScroller"-->
                          <!--:on-refresh="refresh"-->
                          <!--:on-infinite="loadMore"-->
                          <!--ref="my_scroller">-->
                    <!--<div class="order-title">-->
                        <!--<span class="title-type">共<i>{{ totalCount }}</i>个</span>-->
                    <!--</div>-->
                    <!--<ul class="navlist">-->
                        <!--<li v-for="(item, idx) in listData">-->
                            <!--<div class="card-list-info">-->
                                <!--<div class="month-income">-->
                                    <!--<label><img src="../../assets/img/icon-23.png">卡号&nbsp;:</label>-->
                                    <!--<span>{{ item.cardNum }}</span>-->
                                <!--</div>-->
                                <!--<div class="month-income">-->
                                    <!--<label><img src="../../assets/img/icon-24.png">手机&nbsp;:</label>-->
                                    <!--<span>{{ item.memberMobile | hidePhone }}</span>-->
                                <!--</div>-->
                            <!--</div>-->
                            <!--<div class="card-list-time">-->
                                <!--<div class="month-income">-->
                                    <!--<label>激活时间</label>-->
                                <!--</div>-->
                                <!--<div class="month-income">-->
                                    <!--<label class="active">{{ item.activateTimes }}</label>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</li>-->
                    <!--</ul>-->
                <!--</Scroller>-->
                <div class="fr-container" v-infinite-scroll="loadMore"
                     infinite-scroll-disabled="loading"
                     infinite-scroll-distance="150">
                    <div class="order-title">
                        <span class="title-type">共<i>{{ totalCount }}</i>个</span>
                    </div>
                    <ul class="navlist">
                        <li v-for="(item, idx) in listData">
                            <div class="card-list-info">
                                <div class="month-income">
                                    <label><img src="../../assets/img/icon-23.png">卡号&nbsp;:</label>
                                    <span>{{ item.cardNum }}</span>
                                </div>
                                <div class="month-income">
                                    <label><img src="../../assets/img/icon-24.png">手机&nbsp;:</label>
                                    <span>{{ item.memberMobile | hidePhone }}</span>
                                </div>
                            </div>
                            <div class="card-list-time">
                                <div class="month-income">
                                    <label>激活时间</label>
                                </div>
                                <div class="month-income">
                                    <label class="active">{{ item.activateTimes }}</label>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="no-data" v-show="!listData.length">暂无数据</div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import Vue from 'vue'
//    import Scroller from 'vue-scroller'
    import { mapGetters } from 'vuex'
    import * as types from '../../store/mutation-types'
    import { InfiniteScroll } from 'mint-ui';
    import { Toast, MessageBox } from 'mint-ui'
    import apiButielan from '../../api/butielan'

    Vue.use(InfiniteScroll);

    export default {
        components: {

        },

        data () {
            return {
                title: '月结收益订单列表',
                backUrl: '/home/tongji',

                loading: false,
                load_finish: false,
                totalPage: 0,
                totalCount: 0,
                pageNum: 0,
                pageSize: 10,
                listData: [],
                isjihuo: 1
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
//                    cardNum: '8012541587',
//                    cardPwd: '',
//                    operationCenter: '',
//                    operationCenterCode: '',
//                    memberMobile: '13647628816',
//                    status: '',
//                    activateTimes: '2017-01-10'
//                };
//
//                this.listData.push(item)
//            }
            //setTimeout(()=>{
                //this.$refs.my_scroller.resize()
            //}, 10);
            this.loadMore();
        },
        filters: {
            hidePhone (val = '') {

                return val.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
            }
        },
        methods: {
            refresh () {
                console.log('refresh', Date.now());
                this.loading = false;
                this.pageNum = 0;
                this.load_finish = false;
                this.totalCount = 0;
                this.totalPage = 0;
                this.listData.splice(0, this.listData.length);
                this.loadMore(true);
            },

            loadMore (isrefresh = false) {
                console.log('loadMore', Date.now());
                let me = this;
                if (me.loading || me.load_finish) {
                    if (me.load_finish) {
                        //me.$refs.my_scroller.finishInfinite(true);
                    }
                    return;
                }
                me.loading = true;
                me.pageNum++;
                apiButielan.get_card_list({
                    params: {
                        isjihuo: me.isjihuo,
                        pageNum: me.pageNum,
                        pageSize: me.pageSize
                    }
                }).then(function (ret) {

                    if (ret.data && ret.data.items) {
                        let list = ret.data.items;
                        list.forEach(function (item) {

                            me.listData.push(item)
                        })
                    }
                    //setTimeout(()=>{
                        //me.$refs.my_scroller.resize()
                    //}, 10);

                    if (me.totalPage === 0) {
                        me.totalCount = ret.data.totalCount || 0;
                        me.totalPage = Math.ceil(me.totalCount / me.pageSize);
                    }
                    if (me.pageNum >= me.totalPage) {
                        me.loading = true;
                        me.load_finish = true;
                        //me.$refs.my_scroller.finishInfinite(true)
                    } else {
                        me.loading = false;
                    }

                    if (isrefresh) {
                        //me.$refs.my_scroller.finishPullToRefresh()
                    }
                }, function () {
                    Toast({
                        message: '系统错误，请重试',
                        duration: 1000
                    });
                    me.loading = true;
                    me.load_finish = true;
                    //me.$refs.my_scroller.finishInfinite(true);
                    if (isrefresh) {
                        //me.$refs.my_scroller.finishPullToRefresh()
                    }
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import '../../assets/less/huiyuan-card.less';

</style>
