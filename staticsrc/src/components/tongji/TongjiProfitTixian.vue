<template>
    <section class="main">
        <div class="btl-content">
            <div class="fr-container flexbox flexcolumn">
                <div class="nav-tabs">
                    <router-link class="a-cell active" to="/home/tongji/myprofit">提现记录</router-link>
                    <router-link class="a-cell" to="/home/tongji/myprofit/yuejie">月结收益</router-link>
                </div>
                <div class="navlist flex-1">
                    <ul v-infinite-scroll="loadMore"
                        infinite-scroll-disabled="loading"
                        infinite-scroll-distance="150">
                        <li v-for="(item, idx) in listData">
                            <div class="time-list">
                                <div class="col-time">收款时间：{{ item.updateTime }}</div>
                                <div class="apply-time">申请时间：{{ item.applyTime }}</div>
                            </div>
                            <div class="cost">{{ item.amount }}</div>
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
    import apiBank from '../../api/bank'

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
//                    applyNo: '001',
//                    amount: '80',
//                    applyTime: '20161225',
//                    updateTime: '20131224'
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
                apiBank.query_tixian_records({
                    params: {
                        pageNum: me.pageNum,
                        pageSize: me.pageSize
                    }
                }).then(function (ret) {

                    if (ret.data && ret.data.poList) {
                        var list = ret.data.poList;
                        list.forEach(function (item) {
                            me.listData.push(item)
                        })
                    }
                    if (me.totalPage === 0) {
                        me.totalPage = ret.data.page.totalPage;
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
