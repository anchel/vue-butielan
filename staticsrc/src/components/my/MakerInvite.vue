<template>
    <div class="full-mask flexbox flexcolumn">

        <top-nav-small :title="title"></top-nav-small>
        <section class="main">
            <div class="btl-content">
                <div>
                    <img :src="qrImageUrl" style="width: 100%;">
                </div>
                <div>
                    <button class="btn-signout" @click="saveUrl">保存图片</button>
                    <button class="btn-signout" @click="copyUrl" style="margin-top: 0.1rem;">复制链接</button>
                </div>
            </div>
        </section>

    </div>

</template>

<script>
    import { mapGetters } from 'vuex'
    import { Toast } from 'mint-ui'

    export default {
        data () {
            return {
                title: '邀请创客'
            }
        },
        computed: {
            ...mapGetters({
                loginInfo: 'getLoginInfo'
            }),
            inviteUrl () {
                let invitationcode = encodeURIComponent(this.loginInfo.userinfo.invitationCode);
                let agencyid = encodeURIComponent(this.loginInfo.userinfo.agencyId);
                let userid = encodeURIComponent(this.loginInfo.userinfo.userId);

                return 'http://m.teshehui.com/maker/invite?invitationCode=' + invitationcode + '&agencyId=' + agencyid + '&userId=' + userid
            },
            qrImageUrl () {
                return location.origin + '/api/butielan/qrcode?url=' + encodeURIComponent(this.inviteUrl)
            }
        },

        beforeRouteEnter (to, from, next) {
            next((vm) => {
                vm.$store.commit('changeAnimate', {
                    mode: 'normal'
                });
            })
        },

        methods: {
            saveUrl () {
                console.log('saveUrl');
                let url = this.qrImageUrl;
                connectTeshehuiJSBridge(function(bridge){
                    console.log('saveUrl bridge url:' + url);
                    bridge.callHandler('saveUrl', {'url': url, 'ext': 'png'}, function responseCallback(responseData) {
                        console.log('saveUrl bridge callback');
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
                                message: '保存成功，请到相册查看',
                                duration: 1000
                            });
                        } else {
                            Toast({
                                message: '保存失败',
                                duration: 1000
                            });
                        }
                    })
                })
            },

            copyUrl () {
                console.log('copyUrl');
                let url = this.inviteUrl;
                connectTeshehuiJSBridge(function(bridge){
                    console.log('copyUrl bridge');
                    bridge.callHandler('copyText', {'text': url}, function responseCallback(responseData) {
                        console.log('copyUrl bridge callback');
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
                                message: '复制链接成功',
                                duration: 1000
                            });
                        } else {
                            Toast({
                                message: '复制链接失败',
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
    @import '../../assets/less/account-manage.less';

</style>
