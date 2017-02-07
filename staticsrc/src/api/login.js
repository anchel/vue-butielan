/**
 * Created by Anchel on 2016/12/28.
 */
import { Indicator } from 'mint-ui'
import $ from 'webpack-zepto'

export default {

    checkLogin ({params}) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'get',
                dataType: 'jsonp',
                data: params,
                url: '/api/user/check_and_get_user_info',
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

    checkPhoneReg ({params}) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'get',
                dataType: 'jsonp',
                data: params,
                url: '/api/user/check_phone_reg',
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
    }
}