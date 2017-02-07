<template>
    <transition
        appear
        :enter-active-class="animateIn"
        :leave-active-class="animateOut"
        :mode="animateMode"
    >
        <router-view></router-view>
    </transition>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        computed: {
            ...mapGetters(['animateIn', 'animateOut', 'animateMode'])
        }
    }

</script>

<style lang="less">
    @import "./assets/less/base.less";
</style>
