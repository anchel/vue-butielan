<template>
    <div class="header-small">
        <div class="btl-head">
            <img src="../assets/img/icon-03.png" @click="onBack" />
            {{ title }}
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        props: ['title'],
        computed: {

        },
        methods: {
            onBack () {
                this.$store.commit('changeAnimate', {
                    mode: 'reverse'
                });
                this.$router.go(-1)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

</style>
