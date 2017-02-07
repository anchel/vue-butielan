// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'mint-ui/lib/style.css'
import './assets/css/animate.css'

import store from './store'
import router from './router'

import App from './App'

import bottom_nav from './components/BottomNav.vue'
import top_nav_small from './components/TopNavSmall.vue'
import top_back_image from './components/ssi/TopBackImage.vue'
Vue.component('bottom-nav', bottom_nav);
Vue.component('top-nav-small', top_nav_small);
Vue.component('top-back-image', top_back_image);

const whitePathList = [
    '/login',
    '/noperm',
    '/forgetpassword'
];

router.beforeEach((to, from, next) => {
    if (whitePathList.indexOf(to.path) >= 0) {
        next()
    } else {
        store.dispatch('checkLogin', {
            success (userinfo) {
                if (userinfo.isMaker || userinfo.userType == 40) {
                    next()
                } else {
                    next({
                        path: '/noperm'
                    })
                }
            },
            error () {
                next({
                    path: '/login',
                    query: {
                        rurl: to.path
                    }
                })
            }
        })
    }
});


// 注册filter
Vue.filter('fenToYuan', function (value) {
    if (!value) return '0.00';
    let str = '' + value;
    let arr = str.split('').reverse();
    if (arr.length < 3) {
        let offset = 3 - arr.length;
        for (let i=0; i < offset; i++) {
            arr.push(0);
        }
    }
    arr.splice(2, 0, '.');
    return arr.reverse().join('')
});

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
});
