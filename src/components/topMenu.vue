<template>
	<div id="menu_options"> 
		<div @click='(currentMainComponent == "options" ) ? (()=>false) : changeLevel(gameLevel)' v-bind:title='$t("changeLevelGame")' class="icon-level-change menu_options_icon hide_element"></div>
		<div @click='(currentMainComponent == "options" ) ? (()=>false) : $emit("changeTheme")' v-bind:title='$t("switchLayout")' class="icon-design menu_options_icon hide_element"></div>		
		<div @click='$emit("switchOptionComponent")' v-bind:title='$t("options")'  class="icon-options menu_options_icon"></div>	
		<div @click='(currentMainComponent == "options" ) ? (()=>false) : changeMouseButton()'  v-bind:title='$t("switchMouseButton")'  class="menu_options_icon hide_element " v-bind:class='{"icon-flag-change-1" : !$store.state.board.defaultLeftMouseButton , "icon-flag-change-2" : $store.state.board.defaultLeftMouseButton}'></div>	
		<div @click = '(currentMainComponent == "options" ) ? (()=>false) : previousBoard()'  v-bind:title='$t("moveBack")' class="menu_options_icon menu_options_icon icon-arrow-left hide_element" v-bind:class= "{ hiddenButton : ($store.state.board.currentGameStage == 0)}" ></div>
		<div @click = '(currentMainComponent == "options" ) ? (()=>false) : nextBoard()'  v-bind:title='$t("moveFoward")' class="menu_options_icon icon-arrow-right hide_element" v-bind:class= "{ hiddenButton : (($store.state.board.currentGameStage+1) == $store.state.board.savedGameLength)}"></div>
		<div @click = 'changeLanguage()'  v-bind:title='$t("changeLanguage")' class="menu_options_icon" v-bind:class= '{ "icon-land-pl" : $i18n.locale == "en", "icon-land-en" : $i18n.locale == "pl"}'></div>		
	</div>	 		
</template>

<script>

export default {
	name: 'topMenu',   
  
	data:function(){
		return {  
			gameLevel : {
				beginner:true,
				intermediate:false,
				expert:false,	
					
			},
			savedGameLength:0,			
		}	
	},	
   
	props:{
		currentMainComponent : String,
	},		
  
	methods:{		
	
		changeLanguage(){
			if( this.$i18n.locale == 'en' ){
				this.$i18n.locale = 'pl'	
			}	
			else{
				this.$i18n.locale = 'en'
			}					
		},	
	
		loadStage(savedGame,stageId){
			this.$store.commit("board/setBoard", savedGame[stageId].board )	
			this.$store.commit("board/setDiscoveredBombsNumber", savedGame[stageId].discoveredBombsNumber )
			this.$store.commit("board/setGameResult", savedGame[stageId].gameResult )	
		},	
	
		previousBoard(){
			let savedGame =  JSON.parse(sessionStorage.getItem('savedGame'))			
			if(this.$store.state.board.currentGameStage == null){
				this.$store.commit("board/setCurrentGameStage",Object.keys(savedGame).length - 2)	
			}	
			else{
				this.$store.commit("board/setCurrentGameStage",this.$store.state.board.currentGameStage-1)										
			}		
			if(this.$store.state.board.currentGameStage < 0) this.$store.commit("board/setCurrentGameStage",0)		
			this.loadStage(savedGame,this.$store.state.board.currentGameStage)
		},	
	
		nextBoard(){
			let savedGame = JSON.parse(sessionStorage.getItem('savedGame'))
			this.savedGameLength = Object.keys(savedGame).length	
			if(this.$store.state.board.currentGameStage == null){				
				this.$store.commit("board/setCurrentGameStage",this.savedGameLength -1)	
			}	
			else{				
				this.$store.commit("board/setCurrentGameStage",this.$store.state.board.currentGameStage+1)
				if(this.$store.state.board.currentGameStage >= this.savedGameLength  ) this.$store.commit("board/setCurrentGameStage",this.savedGameLength-1) 				
			}			
			this.loadStage(savedGame,this.$store.state.board.currentGameStage)		
		},	
	
		changeLevel(level){			
			if(level.beginner==true){
				this.$store.commit("board/setBoardRows",16)	
				this.$store.commit("board/setBoardCol",16)	
				this.$store.commit("board/setBombs",40)	
				this.gameLevel.beginner=false	
				this.gameLevel.intermediate=true	
				this.gameLevel.expert=false	
			}	
			else if(level.intermediate==true){
				this.$store.commit("board/setBoardRows",16)	
				this.$store.commit("board/setBoardCol",31)	
				this.$store.commit("board/setBombs",99)
				this.gameLevel.beginner=false	
				this.gameLevel.intermediate=false	
				this.gameLevel.expert=true			
			}
			else{
				this.$store.commit("board/setBoardRows",8)	
				this.$store.commit("board/setBoardCol",8)	
				this.$store.commit("board/setBombs",10)	
				this.gameLevel.beginner=true	
				this.gameLevel.intermediate=false	
				this.gameLevel.expert=false		
			}	
				
			this.$store.commit("board/setGameTriggerNextLevel",!this.$store.state.board.gameTriggerNextLevel)
		},	
		
		changeMouseButton(){
			this.$store.commit("board/setDefaultLeftMouseButton",!this.$store.state.board.defaultLeftMouseButton)	
		},			
	},  
}
</script>