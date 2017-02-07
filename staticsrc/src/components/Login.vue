<template>
    <div class="full-mask">
        <header>
            <div class="banner">
                <img src="../assets/img/logo-01.png" />
            </div>
        </header>
        <section class="main">
            <div class="btl-content" v-show="changeLoginType">
                <div class="fr-container">
                    <div class="nav-tabs">
                        <a class="a-cell" :class="{active: passwordLogin}" @click="onChangeLoginType(1)" href="javascript:;">密码登录</a>
                        <a class="a-cell" :class="{active: verifycodeLogin}" @click="onChangeLoginType(2)" href="javascript:;">验证码登录</a>
                    </div>
                </div>
            </div>
            <div class="btl-content" v-show="passwordLogin">
                <div class="btl-signin">
                    <div class="field">
                        <i class="fd-icon"><img src="../assets/img/icon-01.png"></i>
                        <input placeholder="请输入手机号码" type="text" v-model="account">
                    </div>
                    <div class="field">
                        <i class="fd-icon"><img src="../assets/img/icon-02.png"></i>
                        <input placeholder="请输入密码" type="password" v-model="password">
                    </div>
                    <button type="button" class="btn-signin" @click="onLogin">登录</button>
                    <small class="forget" @click="onForgetPD" style="display: none;">忘记密码?</small>
                </div>
            </div>
            <div class="btl-content" v-show="verifycodeLogin">
                <div class="btl-forgetpass">
                    <div class="field">
                        <input placeholder="请输入手机号码" type="text" v-model="account">
                        <i class="fd-icon" @click="onGetVerifyCode">{{ countDownText }}</i>
                    </div>
                    <div class="field">
                        <input placeholder="请输入验证码" type="text" v-model="verifycode">
                    </div>
                    <button type="button" class="btn-signin" @click="onLogin">登录</button>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import $ from 'webpack-zepto'
    import { mapGetters } from 'vuex'
    import { Toast, Indicator } from 'mint-ui'
    import router from '../router'
    import store from '../store'

    export default {
        data () {
            return {
                changeLoginType: true,
                loginType: 1, // 1-密码登录 2-验证码登录

                account: '',
                password: '',
                verifycode: '',

                countDownSec: 0
            }
        },
        beforeRouteEnter (to, from, next) {

//            store.commit('changeAnimate', {
//                mode: 'normal'
//            });

            store.dispatch('checkLogin', {
                success () {
                    next({
                        path: from.path
                    })
                },
                error () {
                    next()
                }
            })
        },
        computed: {
            ...mapGetters({
                loginInfo: 'getLoginInfo'
            }),
            passwordLogin () {
                return this.loginType === 1
            },
            verifycodeLogin () {
                return this.loginType === 2
            },
            countDownText () {
                return this.countDownSec <=0 ? '获取验证码' : this.countDownSec + 'S'
            }
        },
        methods: {
            onChangeLoginType (t) {
                this.loginType = t;
            },
            onLogin () {
                let me = this;
                if (!me.account) {
                    Toast({
                        message: '请填写账号或手机号',
                        duration: 1000
                    });
                    return;
                }
                if (!/^1(3|4|5|7|8)\d{9}$/.test(me.account)) {
                    Toast({
                        message: '请输入正确的手机号',
                        duration: 1000
                    });
                    return;
                }
                if (me.loginType === 1 && !this.password) {
                    Toast({
                        message: '请填写密码',
                        duration: 1000
                    });
                    return;
                }
                if (me.loginType === 2 && !this.verifycode) {
                    Toast({
                        message: '请填写验证码',
                        duration: 1000
                    });
                    return;
                }
                let params = {
                    account: me.account,
                    password: me.password
                };
                if (me.loginType === 2) {
                    params = {
                        account: me.account,
                        verifycode: me.verifycode
                    }
                }
                this.$store.dispatch('doLogin', {
                    loginType: me.loginType,
                    params: params,
                    success () {
                        Toast({
                            message: '登录成功',
                            duration: 1000
                        });
                        setTimeout(function(){
                            router.push({
                                path: me.$route.query.rurl || '/'
                            })
                        }, 1000)
                    },
                    error (err) {
                        Toast({
                            message: (err && err.errmsg) ? err.errmsg : '账号或密码错误',
                            duration: 1000
                        });
                    }
                })
            },
            onGetVerifyCode () {
                let me = this;
                if (me.countDownSec) {
                    return;
                }
                if (!me.account) {
                    Toast({
                        message: '请输入手机号',
                        duration: 1000
                    });
                    return;
                }
                if (!/^1(3|4|5|7|8)\d{9}$/.test(me.account)) {
                    Toast({
                        message: '请输入正确的手机号',
                        duration: 1000
                    });
                    return;
                }
                $.ajax({
                    type: 'get',
                    dataType: 'jsonp',
                    url: '/api/user/get_verification_code',
                    data: {
                        phone: me.account
                    },
                    beforeSend (xhr, settings) {
                        Indicator.open({
                            text : '加载中....',
                            spinnerType : 'triple-bounce'
                        });
                    },
                    complete (xhr, status) {
                        Indicator.close()
                    },
                    success: function (data) {
                        if(data.errcode === 0){
                            // 60秒倒计时
                            Toast({
                                message: '发送成功',
                                duration: 1000
                            });
                            me.countDown();
                        } else {
                            Toast({
                                message: data.errmsg || '操作失败，请重试',
                                duration: 1000
                            });
                        }
                    },
                    error: function () {
                        Toast({
                            message: '操作失败，请重试',
                            duration: 1000
                        });
                    }
                })
            },
            onForgetPD () {
                this.$store.commit('changeAnimate', {
                    mode: 'normal'
                });
                this.$router.push({
                    path: '/forgetpassword'
                })
            },

            countDown () {
                let me = this;
                me.countDownSec = 60;
                let timer = null;
                function t () {
                    if (me.countDownSec <= 0) {
                        clearTimeout(timer);
                    } else {
                        me.countDownSec--;
                        timer = setTimeout(t, 1000)
                    }
                }
                timer = setTimeout(t, 1000)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import '../assets/less/signin.less';


</style>
