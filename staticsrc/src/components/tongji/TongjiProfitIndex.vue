<template>
    <div class="full-mask flexbox flexcolumn">
        <!--<div class="main">-->
            <header>
                <div class="btl-head">
                    <div class="btl-top-nav">
                        <top-back-image :url="homeTongjiUrl"></top-back-image>
                        我的分润
                    </div>
                    <div class="muchmoney">
                        <div class="m-title">余额(元)</div>
                        <div class="num-money">
                            <div class="deposit">{{ getBalance | fenToYuan }}</div>
                            <button class="take-out" @click="onApplyTixian">提现</button>
                        </div>
                        <div class="fenyun-money">分润总额：{{ tongjiData.allWages }}元</div>
                    </div>
                </div>
            </header>
            <router-view></router-view>
            <div class="tixian" v-show="showtixian">
                <div class="tx-container" style="z-index: 2">
                    <div class="tx-title">提现</div>
                    <div class="tx-info">
                        <a class="tx-cell">
                            <label>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</label>
                            <i>{{ accountInfo.holderName }}</i>
                        </a>
                        <a class="tx-cell">
                            <label>银行账户</label>
                            <i>{{ accountInfo.cardNo }}</i>
                            <router-link to="/home/tongji/add-bankcard" v-show="isMaker">
                                <span><img src="../../assets/img/icon-10.png"></span>
                            </router-link>
                        </a>
                        <a class="tx-cell-field">
                            <label>请输入金额<small>(提现金额最少为100)</small></label>
                            <input type="number" min="100" placeholder="" v-model="tixiannum">
                        </a>
                    </div>
                    <button type="button" class="btn-signin" @click="onTixian">确定</button>
                </div>
                <div class="mask" @click="onHideTixian"></div>
            </div>
        <!--</div>-->
    </div>
</template>

<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'
    import * as types from '../../store/mutation-types'
    import { Toast, MessageBox } from 'mint-ui'
    import apiBank from '../../api/bank'

    export default {

        data () {
            return {
                showtixian: false,
                tixiannum: 0,

                homeTongjiUrl: '/home/tongji'
            }
        },

        computed: {
            ...mapGetters({
                loginInfo: 'getLoginInfo',
                accountInfo: 'getAccountInfo',
                getBalance: 'getBalance',
                tongjiData: 'getTongjiData'
            }),
            isMaker () {
                return this.loginInfo.userinfo.isMaker
            }
        },

        methods: {
            onApplyTixian () {
                let me = this;
                let bankcardinfo = this.loginInfo.userinfo.account_info;
                if (!bankcardinfo.bankCardId) {
                    MessageBox.confirm('添加银行卡', {
                        confirmButtonText: '添加',
                        cancelButtonText: '关闭'
                    }).then(function(){
                        me.$router.push({
                            path: '/home/tongji/add-bankcard'
                        })
                    }, function(){

                    });

                } else {
                    this.showtixian = true;
                }
            },
            onHideTixian () {
                this.showtixian = false;
            },
            onTixian () {
                let me = this;
                let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
                if (!reg.test(''+me.tixiannum)) {
                    Toast({
                        message: '提现金额不正确',
                        duration: 1000
                    });
                    return;
                }

                if (me.tixiannum < 100) {
                    Toast({
                        message: '提现金额不能低于100',
                        duration: 1000
                    });
                    return;
                }
                if (me.tixiannum > me.accountInfo.canExtractBalance) {
                    Toast({
                        message: '提现金额不能大于当前最大可提现金额',
                        duration: 1000
                    });
                    return;
                }

                let params = {
                    accountId: me.accountInfo.accountId || 3,
                    bankCardId: me.accountInfo.bankCardId,
                    amount: me.tixiannum * 100,
                    nickName: me.loginInfo.userinfo.nickName,
                    remark: ''
                };
                apiBank.apply_tixian({
                    params
                }).then(function () {
                    Toast({
                        message: '提现申请已提交，请耐心等待',
                        duration: 1000
                    });
                }, function () {
                    Toast({
                        message: '操作失败，请重试',
                        duration: 1000
                    });
                })
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
    .mask {
        position: absolute;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>
