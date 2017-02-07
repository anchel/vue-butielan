<template>
    <div class="full-mask">
        <header>
            <div class="banner">
                <img src="../assets/img/logo-01.png" />
            </div>
        </header>
        <section class="main">
            <div class="noperm">您没有访问权限或暂未通过审核</div>
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

            }
        },
        beforeRouteEnter (to, from, next) {
            next()
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
    @import '../assets/less/signin.less';
    .noperm {
        font-size: 16px;
        padding-top: 1rem;
        text-align: center;
    }

</style>
