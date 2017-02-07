/**
 * Created by Anchel on 2016/12/23.
 */
import * as types from '../mutation-types'

export default {
    state: {
        curtab: ''
    },
    getters: {
        tabIsTJ: (state) => {
            return state.curtab === 'TJ'
        },
        tabIsDD: (state) => {
            return state.curtab === 'DD'
        },
        tabIsCY: (state) => {
            return state.curtab === 'CY'
        },
        tabIsWD: (state) => {
            return state.curtab === 'WD'
        }
    },
    mutations: {
        [types.CHANGE_CUR_TAB] (state, param) {
            state.curtab = param.curtab;
        }
    }
}