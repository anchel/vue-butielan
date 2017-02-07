<template>
    <div class="full-mask flexbox flexcolumn">

            <top-nav-small :title="title"></top-nav-small>
            <section class="main">
                <div class="btl-content">
                    <div class="my-account">
                        <router-link class="ac-cell" to="/home/my/password-reset">
                            <div class="c-txt">修改登录密码</div>
                            <div class="c-jump"><img src="../../assets/img/icon-09.png"></div>
                        </router-link>
                        <router-link class="ac-cell" to="/home/my/phone-reset">
                            <div class="c-txt">修改手机号码</div>
                            <div class="c-number">{{ loginInfo.userinfo.mobilePhone }}</div>
                            <div class="c-jump"><img src="../../assets/img/icon-09.png"></div>
                        </router-link>
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
                title: '账户管理'
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
        methods: {

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import '../../assets/less/account-manage.less';

</style>
