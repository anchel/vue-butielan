<template>
    <div class="main">
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

    export default {
        data () {
            return {

            }
        },
        computed: {
            ...mapGetters(['animateIn', 'animateOut', 'animateMode']),
            ...mapGetters({
                loginInfo: 'getLoginInfo'
            })
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.$store.commit({
                    type: types.CHANGE_CUR_TAB,
                    curtab: 'TJ'
                })
            })
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

</style>
