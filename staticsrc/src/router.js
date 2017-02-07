/**
 * Created by Anchel on 2016/12/23.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

import Login from './components/Login'
import Home from './components/Home'

// 统计
import Tongji from './components/tongji/Tongji.vue'
import TongjiOverview from './components/tongji/TongjiOverview.vue'
import TongjiProfitIndex from './components/tongji/TongjiProfitIndex.vue'
import TongjiProfitTixian from './components/tongji/TongjiProfitTixian.vue'
import TongjiProfitYuejie from './components/tongji/TongjiProfitYuejie.vue'
import MemberCardIndex from './components/membercard/MemberCardIndex.vue'
import MemberCardJihuoList from './components/membercard/MemberCardJihuoList.vue'
import MemberCardDaiJihuoList from './components/membercard/MemberCardDaiJihuoList.vue'

// 订单
import Order from './components/order/Order.vue'
import OrderListYes from './components/order/OrderListYes.vue'
import OrderListNo from './components/order/OrderListNo.vue'

// 成员
import Cy from './components/cy/Cy.vue'
import MemberList from './components/cy/MemberList.vue'
import MakerList from './components/cy/MakerList.vue'
import MakerIndex from './components/cy/MakerIndex.vue'
import MakerMemberList from './components/cy/MakerMemberList.vue'
import MakerMonthList from './components/cy/MakerMonthList.vue'


// 我的
import My from './components/my/My'
import MyIndex from './components/my/MyIndex'
import AccountManage from './components/my/AccountManage'
import PasswordReset from './components/my/PasswordReset'
import PhoneReset from './components/my/PhoneReset.vue'
import AddBankCard from './components/common/AddBankCard.vue'
import MakerInvite from './components/my/MakerInvite.vue'

// 通用
import MonthOrderList from './components/common/MonthOrderList.vue'

import NoPerm from './components/NoPerm.vue'

const routes = [
    {
        path: '',
        redirect: '/home'
    },
    {
        path: '/home',
        component: Home,
        children: [
            {
                path: '',
                redirect: '/home/tongji'
            },
            {
                path: 'tongji',
                component: Tongji,
                children: [
                    {
                        path: '',
                        component: TongjiOverview
                    },
                    {
                        path: 'myprofit',
                        component: TongjiProfitIndex,
                        children: [
                            {
                                path: '',
                                component: TongjiProfitTixian
                            },
                            {
                                path: 'yuejie',
                                component: TongjiProfitYuejie
                            }
                        ]
                    },
                    {
                        path: 'orderlist',
                        component: MonthOrderList
                    },
                    {
                        path: 'add-bankcard',
                        component: AddBankCard
                    },
                    {
                        path: 'membercard',
                        component: MemberCardIndex,
                        children: [
                            {
                                path: '',
                                component: MemberCardJihuoList
                            },
                            {
                                path: 'daijihuolist',
                                component: MemberCardDaiJihuoList
                            }
                        ]
                    }
                ]
            },
            {
                path: 'order',
                component: Order,
                children: [
                    {
                        path: '',
                        component: OrderListYes
                    },
                    {
                        path: 'nofenrun',
                        component: OrderListNo
                    }
                ]
            },
            {
                path: 'cy',
                component: Cy,
                children: [
                    {
                        path: '',
                        component: MemberList
                    },
                    {
                        path: 'maker',
                        component: MakerIndex,
                        children: [
                            {
                                path: '',
                                component: MakerList
                            },
                            {
                                name: 'maker_monthlist',
                                path: 'monthlist',
                                component: MakerMonthList
                            },
                            {
                                name: 'maker_memberlist',
                                path: 'memberlist',
                                component: MakerMemberList
                            },
                            {
                                name: 'maker_month_orderlist',
                                path: 'orderlist',
                                component: MonthOrderList
                            }
                        ]
                    }
                ]
            },
            {
                path: 'my',
                component: My,
                children: [
                    {
                        path: '',
                        component: MyIndex
                    },
                    {
                        path: 'account',
                        component: AccountManage
                    },
                    {
                        path: 'password-reset',
                        component: PasswordReset
                    },
                    {
                        path: 'phone-reset',
                        component: PhoneReset
                    },
                    {
                        path: 'makerinvite',
                        component: MakerInvite
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/forgetpassword',
        component: PasswordReset
    },
    {
        path: '/noperm',
        component: NoPerm
    }
];

export default new VueRouter({
    mode: 'history',
    routes
});