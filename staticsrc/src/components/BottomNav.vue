<template>
    <div class="btm-nav" v-show="showBottomNav">
        <div class="nav-bar-b">
            <a class="nav-list-b" :class="{active: tabIsTJ}" @click="onTabChange('TJ')">
                <div class="nav-img-b"><img src="../assets/img/icon-05.png"></div>
                <div class="nav-text-b">统计</div>
            </a>
            <a class="nav-list-b" :class="{active: tabIsDD}" @click="onTabChange('DD')">
                <div class="nav-img-b"><img src="../assets/img/icon-06.png"></div>
                <div class="nav-text-b">订单</div>
            </a>
            <a class="nav-list-b" :class="{active: tabIsCY}" @click="onTabChange('CY')">
                <div class="nav-img-b"><img src="../assets/img/icon-07.png"></div>
                <div class="nav-text-b">成员</div>
            </a>
            <a class="nav-list-b" :class="{active: tabIsWD}" @click="onTabChange('WD')">
                <div class="nav-img-b"><img src="../assets/img/icon-08.png"></div>
                <div class="nav-text-b">我的</div>
            </a>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    const tabMap = {
        'TJ': '/home/tongji',
        'DD': '/home/order',
        'CY': '/home/cy',
        'WD': '/home/my'
    };

    export default {
        computed: {
            ...mapGetters({
                tabIsTJ: 'tabIsTJ',
                tabIsDD: 'tabIsDD',
                tabIsCY: 'tabIsCY',
                tabIsWD: 'tabIsWD',
                showBottomNav: 'getShowBottomNav'
            })
        },
        methods: {
            onTabChange (tabname) {
                let path = tabMap[tabname];
                this.$router.push({
                    path: path
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../assets/less/btm-nav.less";
</style>
