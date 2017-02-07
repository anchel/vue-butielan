<template>
    <div class="full-mask flexbox flexcolumn">

            <top-nav-small :title="getTitle"></top-nav-small>
            <section class="main" v-show="step1">
                <div class="btl-content">
                    <div class="btl-forgetpass">
                        <div class="field">
                            <input placeholder="请输入原手机号码" type="text" v-model="params.phone">
                            <i class="fd-icon" @click="onGetVerifyCode('old')">{{ countDownText }}</i>
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
                            <input placeholder="请输入新手机号码" type="text" v-model="params.phone_new">
                            <i class="fd-icon" @click="onGetVerifyCode">{{ countDownText2 }}</i>
                        </div>
                        <div class="field">
                            <input placeholder="请输入验证码" type="text" v-model="params.verifycode_new">
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

    var titles = ['', '验证旧手机号', '验证新手机号'];

    export default {
        data () {
            return {
                step: 1,
                title: '修改手机号',
                params: {
                    phone: '',
                    verifycode: '',
                    checktoken: '',
                    phone_new: '',
                    verifycode_new: ''
                },

                countDownSec: 0,
                countDownSec2: 0
            }
        },
        created () {
            this.params.phone = this.loginInfo.userinfo.mobilePhone;
        },
        computed: {
            ...mapGetters({
                loginInfo: 'getLoginInfo'
            }),
            getTitle () {
                return titles[this.step]
            },
            step1 () {
                return this.step === 1
            },
            step2 () {
                return this.step === 2
            },
            countDownText () {
                return this.countDownSec <=0 ? '获取验证码' : this.countDownSec + 'S'
            },
            countDownText2 () {
                return this.countDownSec2 <=0 ? '获取验证码' : this.countDownSec2 + 'S'
            }
        },
        methods: {
            onGetVerifyCode (type) {
                let me = this;
                let isOld = type === 'old';
                if ( (isOld && me.countDownSec) || (!isOld && me.countDownSec2) ) {
                    return;
                }
                let phone = isOld ? me.params.phone : me.params.phone_new;
                if (!phone) {
                    Toast({
                        message: '请输入手机号',
                        duration: 1000
                    });
                    return;
                }
                if (!/^1(3|4|5|7|8)\d{9}$/.test(phone)) {
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
                        phone: phone
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
                            if (isOld) {
                                me.countDown()
                            } else {
                                me.countDown2()
                            }
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
                if (!me.params.phone_new || !me.params.verifycode_new) {
                    Toast({
                        message: '请输入新手机号或验证码',
                        duration: 1000
                    });
                    return;
                }
                $.ajax({
                    type: 'get',
                    dataType: 'jsonp',
                    url: '/api/user/phone_reset',
                    data: {
                        phone_old: me.params.phone,
                        checktoken: me.params.checktoken,
                        phone_new: me.params.phone_new,
                        verifycode: me.params.verifycode_new
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
                                message: '手机号修改成功',
                                duration: 1000
                            });
                            me.$store.dispatch('checkLogin', {
                                force: true
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
            },

            countDown2 () {
                let me = this;
                me.countDownSec2 = 60;
                let timer = null;
                function t () {
                    if (me.countDownSec2 <= 0) {
                        clearTimeout(timer);
                    } else {
                        me.countDownSec2--;
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
