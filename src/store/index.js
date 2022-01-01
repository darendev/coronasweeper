import Vue from "vue";
import Vuex from "vuex";
import board from "./board.js"
 
Vue.use(Vuex); 
 
export default new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',	
	modules: {		
		board,	
	},	
});