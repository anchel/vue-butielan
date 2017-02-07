<template>
    <section class="main">
        <div class="btl-content">
            <div class="fr-container">
                <div class="nav-tabs">
                    <router-link class="a-cell" to="/home/tongji/myprofit">提现记录</router-link>
                    <router-link class="a-cell active" to="/home/tongji/myprofit/yuejie">月结收益</router-link>
                </div>
                <div class="navlist">
                    <ul v-infinite-scroll="loadMore"
                        infinite-scroll-disabled="loading"
                        infinite-scroll-distance="150">
                        <li v-for="(item, idx) in listData">
                            <div class="time-list time-list-w">
                                <div class="month-income">{{ item.monthDesc }}月收益</div>
                                <div class="income-data">{{ item.beginDate }}-{{ item.endDate }}</div>
                            </div>
                            <div class="earnings">
                                <div class="income-amount">{{ item.subsidyAmount }}</div>
                                <div class="amount-data">{{ item.subsidyDate }}</div>
                            </div>
                            <router-link to="/home/tongji/orderlist" tag="div" class="see-more">
                                <img src="../../assets/img/icon-09.png">
                            </router-link>
                        </li>
                    </ul>
                    <div class="no-data" v-show="!listData.length">暂无数据</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import Vue from 'vue'
    import * as types from '../../store/mutation-types'
    import { InfiniteScroll } from 'mint-ui';
    import { Toast, MessageBox } from 'mint-ui'
    import apiButielan from '../../api/butielan'

    Vue.use(InfiniteScroll);

    export default {

        data () {
            return {
                loading: false,
                load_finish: false,
                totalPage: 0,
                totalCount: 0,
                pageNum: 0,
                pageSize: 10,
                listData: []
            }
        },

        computed: {

        },

        created () {
//            for(let i=0; i<15; i++){
//                this.listData.push({
//                    subsidyAmount: '58.34',
//                    subsidyDate: '2016-12-30',
//                    beginDate: '2016-12-25',
//                    endDate: '2013-12-24'
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
                        pageNum: me.pageNum,
                        pageSize: me.pageSize
                    }
                }).then(function (ret) {

                    if (ret.data && ret.data.items) {
                        let list = ret.data.items;
                        list.forEach(function (item) {
                            var reg = /\d*-(\d*)-\d*/i;
                            var regret = reg.exec(item.subsidyDate);
                            item.monthDesc = regret ? regret[1] : '';
                            me.listData.push(item)
                        })
                    }
                    if (me.totalPage === 0) {
                        me.totalPage = Math.ceil(ret.data.totalCount / me.pageSize);
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
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../assets/less/profit.less";
</style>
