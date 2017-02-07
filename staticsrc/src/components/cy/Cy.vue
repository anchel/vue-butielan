<template>
    <router-view></router-view>
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
            ...mapGetters(['animateIn', 'animateOut', 'animateMode'])
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.$store.commit({
                    type: types.CHANGE_CUR_TAB,
                    curtab: 'CY'
                })
            })
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

</style>
