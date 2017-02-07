<template>
    <div class="main flexbox flexcolumn">
        <transition
                appear
                :enter-active-class="animateIn"
                :leave-active-class="animateOut"
                :mode="animateMode"
        >
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import * as types from '../../store/mutation-types'
    import { Toast } from 'mint-ui'

    export default {
        data () {
            return {

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
            ...mapGetters(['animateIn', 'animateOut', 'animateMode']),
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

</style>
