/**
 * Created by Anchel on 2016/12/23.
 */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import login from './modules/login'
import hometab from './modules/hometab'
import tongji from './modules/tongji'

export default new Vuex.Store({
    state: {

        animateIn : 'slideInRight',
        animateOut : 'slideOutLeft',
        animateMode : '',

        showBottomNav: true
    },
    modules: {
        login,
        hometab,
        tongji
    },
    getters: {
        animateIn (state) {
            return 'animated ' + state.animateIn
        },
        animateOut (state) {
            return 'animated ' + state.animateOut
        },
        animateMode (state) {
            return state.animateMode
        },
        getShowBottomNav (state) {
            return state.showBottomNav
        }
    },
    mutations: {
        //改变动画
        changeAnimate(state, payload){
            if(payload.mode == 'normal'){
                state.animateIn = 'slideInRight';
                state.animateOut = 'slideOutLeft';
                state.animateMode = ''
            } else if(payload.mode == 'reverse'){
                state.animateIn = 'slideInLeft';
                state.animateOut = 'slideOutRight';
                state.animateMode = ''
            } else if(payload.mode == 'change'){
                state.animateIn = payload.animateIn;
                state.animateOut = payload.animateOut;
                state.animateMode = payload.animateMode
            }
        },

        changeShowBottomNav (state, flag) {
            state.showBottomNav = flag;
        }
    }
})