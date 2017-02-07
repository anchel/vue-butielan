<template>
    <div class="main flexbox flexcolumn">
        <header>
            <div class="btl-head-fy">
                <top-back-image :url="backUrl"></top-back-image>
                <div class="top-nav-bar">
                    <router-link class="nbar-cell" to="/home/tongji/membercard">已激活</router-link>
                    <router-link class="nbar-cell active" to="/home/tongji/membercard/daijihuolist">待激活</router-link>
                </div>
            </div>
        </header>
        <section class="main">
            <div class="btl-content">
                <div class="fr-container" v-infinite-scroll="loadMore"
                     infinite-scroll-disabled="loading"
                     infinite-scroll-distance="150">
                    <div class="order-title">
                        <span class="title-type">共<i>{{ totalCount }}</i>个</span>
                    </div>
                    <ul class="navlist">
                        <li v-for="(item, idx) in listData">
                            <div class="card-no">
                                <label>卡号：</label><span>{{ item.cardNum }}</span>
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
    import { mapGetters } from 'vuex'
    import * as types from '../../store/mutation-types'
    import { InfiniteScroll } from 'mint-ui';
    import { Toast, MessageBox } from 'mint-ui'
    import apiButielan from '../../api/butielan'

    Vue.use(InfiniteScroll);

    export default {
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
                isjihuo: 0
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
            this.loadMore();
        },
        filters: {

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
    @import '../../assets/less/huiyuan-card.less';

</style>
