<template>
    <div class="full-mask flexbox flexcolumn">
        <header>
            <div class="btl-head">
                <div class="top-bann">
                    <div class="toptext">{{ loginInfo.userinfo.nickName }}</div>
                </div>
            </div>
        </header>
        <section class="main">
            <div class="btl-content">
                <div class="my-account">
                    <router-link class="ac-cell" to="/home/my/account">
                        <div class="c-img"><img src="../../assets/img/icon-15.png"></div>
                        <div class="c-txt">管理账户</div>
                        <div class="c-jump"><img src="../../assets/img/icon-09.png"></div>
                    </router-link>
                    <router-link class="ac-cell" to="/home/my/makerinvite" v-show="!isMaker">
                        <div class="c-img"><img src="../../assets/img/icon-16.png"></div>
                        <div class="c-txt">邀请创客</div>
                        <div class="c-jump"><img src="../../assets/img/icon-09.png"></div>
                    </router-link>
                    <a class="ac-cell" @click="onCheckUpgrade">
                        <div class="c-img"><img src="../../assets/img/icon-17.png"></div>
                        <div class="c-txt" style="position: relative">检测更新<div class="upgrade-block" v-show="canUpgrade">新</div></div>
                        <div class="c-jump"><img src="../../assets/img/icon-09.png"></div>
                    </a>
                    <a class="ac-cell" style="display: none;">
                        <div class="c-img"><img src="../../assets/img/icon-18.png"></div>
                        <div class="c-txt">消息中心</div>
                        <div class="c-jump"><img src="../../assets/img/icon-09.png"></div>
                    </a>
                </div>
                <button class="btn-signout" @click="onLogout">退出登录</button>
            </div>
        </section>
    </div>


</template>

<script>
    import * as types from '../../store/mutation-types'
    import { mapGetters } from 'vuex'
    import { Toast } from 'mint-ui'
    import apputil from '../../util/apputil'
    import apiButielan from '../../api/butielan'

    export default {
        data () {
            return {

                canUpgrade: false,
                downloadUrl: 'http://download.teshehui.com/android/OperationManagement/OperationManagement.apk',
                appstoreUrl: 'https://itunes.apple.com/cn/app/te-she-hui-ying-yun/id886475928?mt=8&uo=4'
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
            }),
            isMaker () {
                return this.loginInfo.userinfo.isMaker
            }
        },
        created () {

            this.queryUpgrade();
        },
        methods: {
            onLogout () {
                let me = this;
                this.$store.dispatch('doLogout', {
                    params: {

                    },
                    success () {
                        Toast({
                            message: '退出成功',
                            duration: 1000
                        });
                        setTimeout(function(){
                            me.$router.push({
                                path: me.$route.query.rurl || '/login'
                            })
                        }, 1000)
                    },
                    error () {
                        Toast({
                            message: '退出登录失败，请重试',
                            duration: 1000
                        });
                    }
                })
            },

            queryUpgrade () {
                let me = this;
                let nowVer = apputil.getAppVersion() || '1.0.0';
                apiButielan.check_upgrade({
                    params: {
                        version: nowVer
                    }
                }).then(function(ret){
                    console.log('nowVer', nowVer);
                    if (ret.data && ret.data.versionName) {
                        console.log('ret.data.versionName', ret.data.versionName);
                        if (nowVer != ret.data.versionName) {
                            me.canUpgrade = true;
                            me.downloadUrl = ret.data.url;
                        }
                    }
                }, function(){

                })
            },

            onCheckUpgrade () {
                let me = this;
                console.log('checkUpgrade');
                let url = me.downloadUrl;
                if (apputil.isIos()) {
                    url = me.appstoreUrl;
                }
                connectTeshehuiJSBridge(function(bridge){
                    console.log('checkUpgrade bridge');
                    bridge.callHandler('upgrade', {'downloadUrl': url}, function responseCallback(responseData) {
                        console.log('checkUpgrade bridge callback');
                        let retjson = {};
                        if (typeof(responseData) == 'string') {
                            try{
                                retjson = JSON.parse(responseData)
                            }catch (e){
                                retjson = responseData
                            }
                        } else {
                            retjson = responseData
                        }

                        console.log(JSON.stringify(retjson));
                        if (retjson && (retjson === 'success' || retjson.code == 0)) {
                            Toast({
                                message: '正在下载更新安装包',
                                duration: 1000
                            });
                        } else {
                            Toast({
                                message: '操作失败',
                                duration: 1000
                            });
                        }
                    })
                })
            }
        }
    }

    function connectTeshehuiJSBridge (callback) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            let ua = navigator.userAgent;
            if (ua.indexOf('Android') > -1 || ua.indexOf('android') > -1) {
                document.addEventListener(
                    'WebViewJavascriptBridgeReady',
                    function() {
                        callback(TeshehuiJSBridge)
                    },
                    false
                );
            } else {
                if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
                window.WVJBCallbacks = [callback];
                let WVJBIframe = document.createElement('iframe');
                WVJBIframe.style.display = 'none';
                WVJBIframe.src = 'https://__bridge_loaded__';
                document.documentElement.appendChild(WVJBIframe);
                setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import '../../assets/less/my-center.less';

    .upgrade-block {
        position: absolute;
        right: 0;
        top: 0.2rem;
        color: red;
    }

</style>
