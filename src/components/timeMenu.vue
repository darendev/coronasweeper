<template>
	<div id="menu_time">
		<div class="number_show bomb_icon_menu">{{discoveredBombsNumber}}</div>
		<div  @click="startGame()" v-bind:class="gameButtonFaceStyle" ></div>
		<div class="number_show clock_icon_menu">{{calcGameTime()}}</div>		
	</div>  
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('board')

export default {
	name: 'timeMenu',
   
	data:function(){
		return { currentTime : new Date().getTime(), lastTime : '0.00', gameButtonFaceStyle : {'new_game_face_button' : true, 'face_unknow' : true}  }	
	},	
   
	watch:{
		currentTime(){
			setTimeout(  () => { this.currentTime = new Date().getTime();} , 1000);
		},

		gameResult(){
			this.gameButtonFaceStyle.face_unknow = false
			this.gameButtonFaceStyle.face_win = false
			this.gameButtonFaceStyle.face_lost = false	
			if(this.gameResult == 'unknow'){
				this.gameButtonFaceStyle.face_unknow = true
			}
			else if(this.gameResult == 'win'){
				this.gameButtonFaceStyle.face_win = true
			}
			else{
				this.gameButtonFaceStyle.face_lost = true	
			}	
		}	
	},	   
  
	computed:{
		...mapState( {	
			gameTime: state => state.gameTime,
			gameActive: state => state.gameActive,	
			cellClickNumber: state => state.cellClickNumber,	
			gameResult: state => state.gameResult,
			discoveredBombsNumber: state => state.discoveredBombsNumber,
			gameTrigger: state => state.gameTrigger,
		}),			
	},	
  
	methods:{
		millisToMinutesAndSeconds(millis) {
			if(millis<0) return '0:00'
			var minutes = Math.floor(millis / 60000);
			var seconds = ((millis % 60000) / 1000).toFixed(0);
			return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
		},		
		
		calcGameTime(){
			if(this.gameActive == false) return '0:00'			
			if( this.gameResult == 'unknow' ){
				this.lastTime = this.millisToMinutesAndSeconds(this.currentTime - this.gameTime.start)				
			}	
			return this.lastTime
		},
		
		startGame(){
			this.$store.commit("board/setGameTrigger",!this.gameTrigger)					
		},			
	},
	
	mounted () {
		this.currentTime = new Date().getTime();	
	}
  
}
</script>

<style>
@import "~@/sass/time-menu.scss";
</style>

