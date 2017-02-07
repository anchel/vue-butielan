<template>
    <div class="full-mask flexbox flexcolumn">
        <header>
            <div class="btl-head">
                <div class="muchmoney">
                    <router-link to="/home/tongji/myprofit">
                        <img src="../../assets/img/icon-11.png">
                    </router-link>

                    <div class="all-money">
                        <div class="m-title">余额(元)</div>
                        <div class="num-money">{{ getBalance | fenToYuan }}</div>
                    </div>
                </div>
                <div class="people" v-show="isYunyingCenter">
                    <div class="peo-type">
                        <dl>
                            <dt>创客(人)</dt>
                            <dd>{{ tongjiData.promoters }}</dd>
                        </dl>
                        <!--<dl>-->
                            <!--<dt>商户(人)</dt>-->
                            <!--<dd>30000</dd>-->
                        <!--</dl>-->
                    </div>
                </div>
            </div>
        </header>
        <section>
            <div class="btl-content">
                <div class="pro-type">
                    <router-link class="pro-cell" to="/home/tongji/membercard/daijihuolist">
                        <div class="cell-name">会员卡库存(张)</div>
                        <div class="cell-num">{{ tongjiData.cardStock }}</div>
                    </router-link>
                    <router-link class="pro-cell" to="/home/cy">
                        <div class="cell-name">本月新增会员(人)</div>
                        <div class="cell-num">{{ tongjiData.monthMembersNum }}</div>
                    </router-link>
                    <a class="pro-cell">
                        <div class="cell-name">上期分润(元)</div>
                        <div class="cell-num">{{ tongjiData.lastMonthWages }}</div>
                    </a>
                    <router-link class="pro-cell" to="/home/tongji/membercard">
                        <div class="cell-name">会员卡总数(张)</div>
                        <div class="cell-num">{{ tongjiData.cardTotal }}</div>
                    </router-link>
                    <router-link class="pro-cell" to="/home/cy">
                        <div class="cell-name">会员总数(人)</div>
                        <div class="cell-num">{{ tongjiData.memberTotal }}</div>
                    </router-link>
                    <a class="pro-cell">
                        <div class="cell-name">分润总额(元)</div>
                        <div class="cell-num">{{ tongjiData.allWages }}</div>
                    </a>
                </div>
            </div>
        </section>
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
            ...mapGetters({
                loginInfo: 'getLoginInfo',
                getBalance: 'getBalance',
                isYunyingCenter: 'isYunyingCenter',
                tongjiData: 'getTongjiData'
            })
        },

        beforeRouteEnter (to, from, next) {
            next((vm) => {
                vm.$store.dispatch('updateTongjiData', {params: {}, success: function (data) {

                }, error: function (e) {

                }});

                vm.$store.commit('changeAnimate', {
                    mode: 'normal'
                });
            })
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../assets/less/index.less";
</style>
