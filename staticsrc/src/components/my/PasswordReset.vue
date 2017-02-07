<template>
    <div class="full-mask flexbox flexcolumn">

            <top-nav-small :title="title"></top-nav-small>
            <section class="main" v-show="step1">
                <div class="btl-content">
                    <div class="btl-forgetpass">
                        <div class="field">
                            <input placeholder="请输入手机号码" type="text" v-model="params.phone">
                            <i class="fd-icon" @click="onGetVerifyCode">{{ countDownText }}</i>
                        </div>
                        <div class="field">
                            <input placeholder="请输入验证码" type="text" v-model="params.verifycode">
                        </div>
                        <button type="button" class="btn-signin" @click="onNextStep">下一步</button>
                    </div>
                </div>
            </section>
            <section class="main" v-show="step2">
                <div class="btl-content">
                    <div class="btl-forgetpass">
                        <div class="field">
                            <input placeholder="新密码" type="password" v-model="params.password">
                        </div>
                        <div class="field">
                            <input placeholder="确认新密码" type="password" v-model="params.password_repeat">
                        </div>
                        <button type="button" class="btn-signin" @click="onOK">确定</button>
                    </div>
                </div>
            </section>

    </div>

</template>

<script>
    import { mapGetters } from 'vuex'
    import { Toast } from 'mint-ui'
    import { Indicator } from 'mint-ui'
    import $ from 'webpack-zepto'

    export default {
        data () {
            return {
                step: 1,
                title: '重置密码',
                params: {
                    phone: '',
                    verifycode: '',
                    checktoken: '',
                    password: '',
                    password_repeat: ''
                },
                countDownSec: 0
            }
        },
        created () {
            this.params.phone = this.loginInfo.userinfo.mobilePhone;
        },
        computed: {
            ...mapGetters({
                loginInfo: 'getLoginInfo'
            }),
            step1 () {
                return this.step === 1
            },
            step2 () {
                return this.step === 2
            },
            countDownText () {
                return this.countDownSec <=0 ? '获取验证码' : this.countDownSec + 'S'
            }
        },
        beforeRouteEnter (to, from, next) {
            next()
        },
        methods: {
            onGetVerifyCode () {
                let me = this;
                if (me.countDownSec) {
                    return;
                }
                if (!me.params.phone) {
                    Toast({
                        message: '请输入手机号',
                        duration: 1000
                    });
                    return;
                }
                if (!/^1(3|4|5|7|8)\d{9}$/.test(me.params.phone)) {
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
                        phone: me.params.phone
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
            onNextStep () {
                let me = this;
                if (!me.params.verifycode) {
                    Toast({
                        message: '请输入验证码',
                        duration: 1000
                    });
                    return;
                }
                $.ajax({
                    type: 'get',
                    dataType: 'jsonp',
                    url: '/api/user/check_verifycode',
                    data: {
                        phone: me.params.phone,
                        verifycode: me.params.verifycode
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
                            me.params.checktoken = data.data.checkToken;
                            me.step = 2;
                        } else {
                            Toast({
                                message: data.errmsg || '请填写正确的验证码',
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
            onOK () {
                let me = this;
                if (!me.params.password || !me.params.password_repeat) {
                    Toast({
                        message: '请输入密码',
                        duration: 1000
                    });
                    return;
                }
                if (me.params.password !== me.params.password_repeat) {
                    Toast({
                        message: '两次密码不一致',
                        duration: 1000
                    });
                    return;
                }
                $.ajax({
                    type: 'get',
                    dataType: 'jsonp',
                    url: '/api/user/password_reset',
                    data: {
                        phone: me.params.phone,
                        checktoken: me.params.checktoken,
                        password: me.params.password
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
                            Toast({
                                message: '密码修改成功',
                                duration: 1000
                            });
                            setTimeout(function () {
                                me.$router.push({
                                    path: '/home/my/account'
                                })
                            }, 500)
                        } else {
                            Toast({
                                message: data.errmsg || '修改失败，请重试',
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
    @import '../../assets/less/forget-password.less';

</style>
