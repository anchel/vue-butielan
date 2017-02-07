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

    add_bank_card ({params = {}}) {
        return this.preRequest({
            url: '/api/pay/add_bank_card',
            params: params
        })
    },
    update_bank_card ({params = {}}) {
        return this.preRequest({
            url: '/api/pay/update_bank_card',
            params: params
        })
    },
    query_bank_card ({params = {}}) {
        return this.preRequest({
            url: '/api/pay/query_bank_card',
            params: params
        })
    },
    delete_bank_card ({params = {}}) {
        return this.preRequest({
            url: '/api/pay/delete_bank_card',
            params: params
        })
    },
    query_balance ({params = {}}) {
        return this.preRequest({
            url: '/api/pay/query_balance',
            params: params
        })
    },
    apply_tixian ({params = {}}) {
        return this.preRequest({
            url: '/api/pay/apply_tixian',
            params: params
        })
    },
    query_tixian_records ({params = {}}) {
        return this.preRequest({
            url: '/api/pay/query_tixian_records',
            params: params
        })
    }
}