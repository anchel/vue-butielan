<template>
    <router-view></router-view>
</template>

<script>
    import * as types from '../../store/mutation-types'

    export default {
        data () {
            return {

            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.$store.commit({
                    type: types.CHANGE_CUR_TAB,
                    curtab: 'DD'
                })
            })
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

</style>
