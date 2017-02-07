<template>
    <div class="full-mask flexbox flexcolumn">
        <top-nav-small :title="title"></top-nav-small>
        <section class="main">
            <div class="btl-content">
                <div class="btl-forgetpass">
                    <div class="field">
                        <input placeholder="持卡人姓名" type="text" v-model="bankCardInfo.holderName">
                    </div>
                    <div class="field">
                        <input placeholder="开户行名称" type="text" v-model="bankCardInfo.bankName">
                    </div>
                    <div class="field">
                        <input placeholder="银行卡账号" type="text" v-model="bankCardInfo.cardNo">
                    </div>
                    <button type="button" class="btn-signin" @click="onOK">完成</button>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import $ from 'webpack-zepto'
    import * as types from '../../store/mutation-types'
    import { mapGetters } from 'vuex'
    import { Toast, MessageBox } from 'mint-ui'
    import apiBank from '../../api/bank'

    export default {
        data () {
            return {
                bankCardInfo: {
                    bankCardId: undefined,
                    holderName: '',
                    idNO: '',
                    cardNo: '',
                    bankName: '',
                    branchName: '',
                    provinceName: '',
                    cityName: ''
                }
            }
        },
        created () {
            $.extend(this.bankCardInfo, this.loginInfo.userinfo.account_info);
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
            title () {
                return this.bankCardInfo.bankCardId ? '修改银行卡' : '添加银行卡'
            },
            ...mapGetters({
                loginInfo: 'getLoginInfo'
            })
        },
        methods: {
            onOK () {
                let me = this;
                if (!this.bankCardInfo.holderName || !this.bankCardInfo.cardNo || !this.bankCardInfo.bankName) {
                    Toast({
                        message: '请填写完整的银行卡信息',
                        duration: 1000
                    });
                    return;
                }
                MessageBox.confirm('确定提交?').then(action => {
                    let fn = me.bankCardInfo.bankCardId ? apiBank.update_bank_card : apiBank.add_bank_card;
                    fn.call(apiBank, {params: me.bankCardInfo}).then(function () {
                        me.$store.dispatch('queryBankCardInfo').then(function (data) {
                            if (data.data && data.data.length) {
                                $.extend(me.bankCardInfo, data.data[0])
                            }
                            return data;
                        }).catch(function () {

                        });

                        Toast({
                            message: '操作成功',
                            duration: 1000
                        });
                    }, function () {
                        Toast({
                            message: '操作失败，请重试',
                            duration: 1000
                        });
                    });

                }, () => {

                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import '../../assets/less/forget-password.less';
</style>
