/**
 * Created by Anchel on 2016/12/23.
 */
import { Indicator } from 'mint-ui'
import $ from 'webpack-zepto'
import apiLogin from '../../api/login'
import apiBank from '../../api/bank'

export default {
    state: {
        hasRequest: false,
        islogin: false,
        userinfo: {
            userId: '',
            token: '',
            mobilePhone: '',
            nickName: '',
            invitationCode: '',
            agencyId: 0,

            isMaker: 0,
            userType: 0, // 0-普通用户 1-商户 10-分销商 20-供应商 40-运营中心

            account_info: {
                accountId: '',
                usableBalance: 0,
                canExtractBalance: 0,
                freezeBalance: 0,
                accountStatus: '',

                bankCardId: '',
                holderName: '',
                cardNo: ''
            }
        }
    },
    getters: {
        getLoginInfo (state) {
            return state;
        },
        getBalance (state) {
            return state.userinfo.account_info.usableBalance
        },

        getAccountInfo (state) {
            return state.userinfo.account_info
        },

        isYunyingCenter (state) {
            return state.userinfo.userType === 40
        }
    },
    mutations: {
        setLoginInfo (state, params) {
            $.extend(state, params)
        },
        setBankCardInfo (state, params) {
            $.extend(state.userinfo.account_info, params)
        }
    },
    actions: {
        checkLogin ({commit, state}, {params = {}, success, error, force = false}) {
            if (!force && state.hasRequest) {
                if (state.islogin) {
                    success && success(state.userinfo);
                } else {
                    error && error();
                }
                return;
            }
            return apiLogin.checkLogin({params}).then((data)=>{
                commit('setLoginInfo', {
                    hasRequest: true,
                    islogin: true,
                    userinfo: data.data
                });
                success && success(data.data);
            }, (e, hasRequest) => {
                if (hasRequest) {
                    commit('setLoginInfo', {
                        hasRequest: true
                    });
                }
                error && error(e);
            });
        },

        doLogin ({commit}, {loginType = 1, params = {}, success, error}) {
            let url = loginType === 1 ? '/api/user/password_login' : '/api/user/verifycode_login';
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
                        commit('setLoginInfo', {
                            islogin: true
                        });
                        success && success(data);
                    } else {
                        error && error(data);
                    }
                },
                error (xhr, errorType, e) {
                    error && error(e);
                }
            })
        },

        doLogout ({commit}, {params = {}, success, error}) {
            $.ajax({
                type: 'get',
                dataType: 'jsonp',
                data: params,
                url: '/api/user/logout',
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
                        commit('setLoginInfo', {
                            hasRequest: false,
                            islogin: false
                        });
                        success && success(data);
                    } else {
                        error && error(data);
                    }
                },
                error (xhr, errorType, e) {
                    error && error(e);
                }
            })
        },

        queryBankCardInfo ({commit}) {
            return apiBank.query_bank_card({}).then(function (data) {
                if (data.data && data.data.length) {
                    commit('setBankCardInfo', data.data[0])
                }
                return data;
            }, function (e) {
                return e;
            });
        }
    }
}