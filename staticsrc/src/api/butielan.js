/**
 * Created by Anchel on 2016/12/28.
 */
import { Indicator } from 'mint-ui'
import $ from 'webpack-zepto'

export default {

    preRequest ({url, params}) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'get',
                dataType: 'jsonp',
                data: params,
                url: url,
                beforeSend (xhr, settings) {
                    Indicator.open({
                        text : '加载中....',
                        spinnerType : 'triple-bounce'
                    });
                },
                complete (xhr, status) {
                    Indicator.close()
                },
                success (data) {
                    if (data && data.errcode === 0) {
                        resolve(data)
                    } else {
                        reject(data, true)
                    }
                },
                error (xhr, errorType, e) {
                    reject(e)
                }
            })
        })
    },

    // 获取统计数据
    get_tongji_data ({params}) {
        return this.preRequest({
            url: '/api/butielan/get_tongji_data',
            params: params
        })
    },

    // 获取本月数据
    get_month_tongji ({params}) {
        return this.preRequest({
            url: '/api/butielan/get_month_tongji',
            params: params
        })
    },

    // 获取月结收益列表
    get_yuejie_list ({params}) {
        return this.preRequest({
            url: '/api/butielan/get_yuejie_list',
            params: params
        })
    },

    // 获取会员列表
    get_member_list ({params}) {
        return this.preRequest({
            url: '/api/butielan/get_member_list',
            params: params
        })
    },

    // 获取创客列表
    get_maker_list ({params}) {
        return this.preRequest({
            url: '/api/butielan/get_maker_list',
            params: params
        })
    },

    // 获取分润订单列表，包括已分润，未分润
    get_order_list ({params}) {
        return this.preRequest({
            url: '/api/butielan/get_order_list',
            params: params
        })
    },

    // 获取会员卡列表
    get_card_list ({params}) {
        return this.preRequest({
            url: '/api/butielan/get_card_list',
            params: params
        })
    },

    // 获取用户信息
    get_user_info ({params}) {
        return this.preRequest({
            url: '/api/butielan/get_user_info',
            params: params
        })
    },

    // 创客审核操作
    maker_shenhe ({params}) {
        return this.preRequest({
            url: '/api/butielan/maker_shenhe',
            params: params
        })
    },

    // 检查升级
    check_upgrade ({params = {}}) {
        return this.preRequest({
            url: '/api/butielan/check_upgrade',
            params: params
        })
    }
}