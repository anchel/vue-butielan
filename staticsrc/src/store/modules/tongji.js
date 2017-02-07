/**
 * Created by Anchel on 2016/12/23.
 */
import { Indicator } from 'mint-ui'
import $ from 'webpack-zepto'
import apiLogin from '../../api/login'
import apiBank from '../../api/bank'
import apiButielan from '../../api/butielan'

export default {
    state: {
        cardStock: 0, // 会员卡库存
        monthMembersNum: 0, // 本月新增会员
        lastMonthWages: 0, // 上期分润
        cardTotal: 0, // 会员卡总数
        memberTotal: 0, // 会员总数
        allWages: 0, // 分润总额
        promoters: 0 // 创客，商户总数
    },
    getters: {
        getTongjiData (state) {
            return state;
        }
    },
    mutations: {
        setTongjiData (state, params) {
            $.extend(state, params)
        }
    },
    actions: {
        updateTongjiData ({commit, state}, {params = {}, success, error}) {
            return apiButielan.get_tongji_data({params}).then( (data) => {
                commit('setTongjiData', data.data);
                success && success(data);
                return data;
            }, (e) => {
                error && error(e);
            });
        }
    }
}