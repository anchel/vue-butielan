<template>
    <img src="../../assets/img/icon-03.png" @click="onBack" />
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        props: ['url'],
        computed: {

        },
        methods: {
            onBack () {
                this.$store.commit('changeAnimate', {
                    mode: 'reverse'
                });
                this.url ? this.$router.push({path: this.url}) : this.$router.go(-1)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

</style>
