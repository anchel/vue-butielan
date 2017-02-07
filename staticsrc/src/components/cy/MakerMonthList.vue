<template>
    <div class="full-mask flexbox flexcolumn">
        <top-nav-small :title="title"></top-nav-small>
        <section class="main">
            <div class="btl-content">
                <div class="fr-container" v-infinite-scroll="loadMore"
                     infinite-scroll-disabled="loading"
                     infinite-scroll-distance="150">
                    <div class="order-title">
                        <span class="title-type">共<i>123</i></span>
                    </div>
                    <div class="navlist">
                        <ul>
                            <li v-for="(item, idx) in listData">
                                <div class="time-list time-list-w">
                                    <div class="month-income">{{ item.monthDesc }}收益</div>
                                    <div class="income-data">{{ item.beginDate }}-{{ item.endDate }}</div>
                                </div>
                                <div class="earnings">
                                    <div class="income-amount">{{ item.subsidyAmount }}</div>
                                    <div class="amount-data">{{ item.subsidyDate }}</div>
                                </div>
                                <router-link :to="{name: 'maker_month_orderlist', query: {userid: item.userid, beginDate: item.beginDate, endDate: item.endDate}}">
                                    <div class="see-more"><img src="../../assets/img/icon-09.png"></div>
                                </router-link>

                            </li>
                        </ul>
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

    export default {
        data () {
            return {
                title: '月结收益列表',

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
                vm.$store.commit('changeAnimate', {
                    mode: 'normal'
                });
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
            let me = this;
//            for(let i=0; i<10; i++){
//                this.listData.push({
//                    subsidyAmount: '58.34',
//                    subsidyDate: '2016-12-30',
//                    beginDate: '2016-12-25',
//                    endDate: '2013-12-24',
//                    monthDesc: '12月',
//                    userid: me.$route.query.userid
//                })
//            }
            this.loadMore();
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
                apiButielan.get_yuejie_list({
                    params: {
                        requestUserId: me.$route.query.userid,
                        pageNum: me.pageNum,
                        pageSize: me.pageSize
                    }
                }).then(function (ret) {

                    if (ret.data && ret.data.items) {
                        let list = ret.data.items;
                        list.forEach(function (item) {
                            item.userid = me.$route.query.userid;
                            var reg = /\d*-(\d*)-\d*/i;
                            var regret = reg.exec(item.subsidyDate);
                            item.monthDesc = regret ? regret[1] : '';
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
    @import '../../assets/less/mon-state.less';

</style>
