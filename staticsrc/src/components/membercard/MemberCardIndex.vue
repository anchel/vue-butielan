<template>
    <div class="full-mask flexbox flexcolumn">

        <router-view></router-view>

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

            }
        },

        computed: {
            ...mapGetters({
                loginInfo: 'getLoginInfo',
                accountInfo: 'getAccountInfo',
                getBalance: 'getBalance'
            })
        },

        methods: {

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

</style>
