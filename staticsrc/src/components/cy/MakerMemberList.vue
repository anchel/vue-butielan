<template>
    <div class="full-mask flexbox flexcolumn">
        <top-nav-small :title="title"></top-nav-small>
        <section class="main">
            <div class="btl-content">
                <div class="fr-container" v-infinite-scroll="loadMore"
                     infinite-scroll-disabled="loading"
                     infinite-scroll-distance="150">
                    <div class="order-title">
                        <span class="title-type">共<i>{{ totalCount }}</i>个</span>
                    </div>
                    <ul class="navlist">
                        <li v-for="(item, idx) in listData" :class="{'ex-members': !item.isPay}">
                            <div class="time-list time-list-w">
                                <div class="month-income">
                                    <label>手机号码：</label>
                                    <span>{{ item.mobile | hidePhone }}</span>
                                </div>
                            </div>
                            <div class="earnings" v-if="item.isPay">
                                <div class="income-amount">付费会员</div>
                                <div class="amount-data">{{ item.registeTime }}</div>
                            </div>
                            <div class="earnings" v-else="true">
                                <div class="income-amount">体验会员</div>
                                <div class="amount-data">{{ item.registeTime }}</div>
                            </div>
                        </li>
                    </ul>
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

    export default {
        data () {
            return {
                title: '创客会员列表',

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
//                    memberLevel: 2,
//                    registeTime: '2016-12-25',
//                    isPay: Math.round(Math.random())
//                };
//                this.listData.push(item)
//            }
            this.loadMore();
        },
        filters: {
            hidePhone (val) {
                return val.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
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
                apiButielan.get_member_list({
                    params: {
                        requestUserId: me.$route.query.userid,
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
    @import '../../assets/less/members-02.less';

</style>
