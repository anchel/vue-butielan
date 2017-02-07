<template>
    <div class="full-mask flexbox flexcolumn">
        <router-view></router-view>
        <bottom-nav></bottom-nav>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import router from '../router'

    export default {
        computed: {
            ...mapGetters({
                loginInfo: 'getLoginInfo'
            })
        },
        beforeRouteEnter: function (to, from, next) {
            next();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

</style>
