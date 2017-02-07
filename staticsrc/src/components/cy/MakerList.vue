<template>
    <div class="main flexbox flexcolumn">
        <header>
            <div class="btl-head-nav">
                <div class="top-nav-bar">
                    <router-link class="nbar-cell" to="/home/cy">会员</router-link>
                    <router-link class="nbar-cell active" to="/home/cy/maker">创客</router-link>
                </div>
            </div>
        </header>
        <section class="main">
            <div class="btl-content">
                <div class="fr-container" v-infinite-scroll="loadMore"
                     infinite-scroll-disabled="loading"
                     infinite-scroll-distance="150">
                    <div class="main-list">
                        <div class="order-title">
                            <span class="title-type"><i>等待审核</i></span>
                        </div>
                        <ul class="navlist">
                            <li v-for="(item, idx) in shenhe.listData">
                                <div class="time-list time-list-w">
                                    <div class="month-income">
                                        <label><img src="../../assets/img/icon-13.png">创&nbsp;&nbsp;客:</label>
                                        <span>{{ item.name }}</span>
                                    </div>
                                    <div class="month-income">
                                        <label><img src="../../assets/img/icon-14.png">受邀者:</label>
                                        <span>{{ item.mobile | hidePhone }}</span>
                                    </div>
                                </div>
                                <button class="btn-pass-audit" @click="makerShenhe(idx)">通过审核</button>
                            </li>
                        </ul>
                        <div class="no-data" v-show="!shenhe.listData.length">暂无数据</div>
                    </div>

                    <div class="main-list main-earn">
                        <div class="order-title">
                            <span class="title-type"><i>收益中</i></span>
                        </div>
                        <ul class="navlist">
                            <li v-for="(item, idx) in shouyi.listData">
                                <div class="time-list time-list-w">
                                    <div class="month-income">
                                        <label><img src="../../assets/img/icon-13.png">创&nbsp;&nbsp;客:</label>
                                        <span>{{ item.name }}</span>
                                    </div>
                                    <div class="month-income">
                                        <label><img src="../../assets/img/icon-14.png">受邀者:</label>
                                        <span>{{ item.mobile | hidePhone }}</span>
                                    </div>
                                </div>
                                <router-link :to="{name: 'maker_monthlist', query: {userid: item.userId}}">
                                    <button class="btn-pass-audit">月结收益</button>
                                </router-link>
                                <router-link :to="{name: 'maker_memberlist', query: {userid: item.userId}}">
                                    <button class="btn-pass-memlist">会员列表</button>
                                </router-link>
                            </li>
                        </ul>
                        <div class="no-data" v-show="!shouyi.listData.length">暂无数据</div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import Vue from 'vue'
    import $ from 'webpack-zepto'
    import * as types from '../../store/mutation-types'
    import { mapGetters } from 'vuex'
    import { InfiniteScroll } from 'mint-ui';
    import { Toast, MessageBox } from 'mint-ui'
    import apiButielan from '../../api/butielan'

    Vue.use(InfiniteScroll);

    export default {
        data () {
            return {
                loading: false,
                // 审核中
                shenhe: {

                    load_finish: false,
                    totalPage: 0,
                    totalCount: 0,
                    pageNum: 0,
                    pageSize: 10,
                    listData: [],
                    isshenhe: 0
                },
                // 收益中
                shouyi: {

                    load_finish: false,
                    totalPage: 0,
                    totalCount: 0,
                    pageNum: 0,
                    pageSize: 10,
                    listData: [],
                    isshenhe: 1
                }
            }
        },
        beforeRouteEnter (to, from, next) {
            next((vm) => {
                vm.$store.commit('changeAnimate', {
                    mode: 'normal'
                });
            })
        },
        computed: {
            ...mapGetters({
                loginInfo: 'getLoginInfo'
            })
        },
        created () {
//            for(let i=0; i<5; i++){
//                let item = {
//                    name: '张三',
//                    invitationCode: '524861',
//                    mobile: '15818515514',
//                    userid: 43567,
//                    status: 1
//                };
//                this.shenhe.listData.push(item)
//            }
//            for(let i=0; i<5; i++){
//                let item = {
//                    name: '张三',
//                    invitationCode: '524861',
//                    mobile: '15818515514',
//                    userid: 62539,
//                    status: 1
//                };
//                this.shouyi.listData.push(item)
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
                if (!this.shenhe.load_finish) {
                    this.loadShenheList()
                } else {
                    this.loadShouyiList()
                }
            },

            loadShenheList () {
                console.log('loadShenheList', Date.now());
                let me = this;
                var listconf = me.shenhe;
                if (listconf.load_finish) {
                    return;
                }
                me.loading = true;
                listconf.pageNum++;
                apiButielan.get_maker_list({
                    params: {
                        isshenhe: listconf.isshenhe,
                        pageNum: listconf.pageNum,
                        pageSize: listconf.pageSize
                    }
                }).then(function (ret) {

                    if (ret.data && ret.data.items) {
                        let list = ret.data.items;
                        list.forEach(function (item) {

                            listconf.listData.push(item)
                        })
                    }

                    if (listconf.totalPage === 0) {
                        listconf.totalCount = ret.data.totalCount || 0;
                        listconf.totalPage = Math.ceil(listconf.totalCount / listconf.pageSize);
                    }
                    if (listconf.pageNum >= listconf.totalPage) {
                        listconf.load_finish = true;
                    }
                    me.loading = false;
                }, function () {
                    Toast({
                        message: '系统错误，请重试',
                        duration: 1000
                    });
                    me.loading = false;
                    listconf.load_finish = true;
                });
            },

            loadShouyiList () {
                console.log('loadShouyiList', Date.now());
                let me = this;
                var listconf = me.shouyi;
                if (listconf.load_finish) {
                    return;
                }
                me.loading = true;
                listconf.pageNum++;
                apiButielan.get_maker_list({
                    params: {
                        isshenhe: listconf.isshenhe,
                        pageNum: listconf.pageNum,
                        pageSize: listconf.pageSize
                    }
                }).then(function (ret) {

                    if (ret.data && ret.data.items) {
                        let list = ret.data.items;
                        list.forEach(function (item) {

                            listconf.listData.push(item)
                        })
                    }

                    if (listconf.totalPage === 0) {
                        listconf.totalCount = ret.data.totalCount || 0;
                        listconf.totalPage = Math.ceil(listconf.totalCount / listconf.pageSize);
                    }
                    if (listconf.pageNum >= listconf.totalPage) {
                        me.loading = true;
                        listconf.load_finish = true;
                    } else {
                        me.loading = false;
                    }
                }, function () {
                    Toast({
                        message: '系统错误，请重试',
                        duration: 1000
                    });
                    me.loading = true;
                    listconf.load_finish = true;
                });
            },

            makerShenhe (idx) {
                let me = this;
                let listconf = me.shenhe;
                let listconf_shouyi = me.shouyi;
                let item = listconf.listData[idx];
                apiButielan.maker_shenhe({
                    params: {
                        requestUserId: item.userId
                    }
                }).then(function(ret){
                    if (ret.data) {
                        Toast({
                            message: '操作成功',
                            duration: 1000
                        });
                        listconf.listData.splice(idx, 1);
                        let item_new = $.extend({}, item);
                        item_new.status = 1;
                        listconf_shouyi.listData.push(item_new);
                    } else {
                        Toast({
                            message: '操作失败，请重试',
                            duration: 1000
                        });
                    }
                }, function(){
                    Toast({
                        message: '系统错误，请重试',
                        duration: 1000
                    });
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import '../../assets/less/maker.less';

</style>
