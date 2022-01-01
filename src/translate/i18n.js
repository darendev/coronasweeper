import Vue from 'vue'
import VueI18n from 'vue-i18n'
import english from './languages/english.js'
import polish from './languages/polish.js'
Vue.use(VueI18n)

var messages = {...polish,...english}

export default new VueI18n({
    locale: 'en', 
    fallbackLocale: 'pl', 
    messages, 
});
