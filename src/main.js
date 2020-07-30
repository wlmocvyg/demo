import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'


import {
  Button, NavBar, Field, Dialog, Notify, Tab, Tabs, Tabbar, TabbarItem,
  GoodsAction, GoodsActionIcon, GoodsActionButton, Sku, Stepper, SubmitBar, Toast
  , Pagination, Search, Lazyload, Swipe, SwipeItem
  , Sidebar, SidebarItem
} from 'vant'

Vue
  .use(SwipeItem).use(Swipe).use(Lazyload).use(Search).use(Pagination).use(SidebarItem).use(Sidebar).use(Toast).use(SubmitBar).use(Stepper).use(GoodsAction).use(GoodsActionButton).use(GoodsActionIcon).use(Button).use(NavBar).use(Field).use(Dialog).use(Notify).use(Tab).use(Tabs).use(Tabbar).use(TabbarItem).use(Sku)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
