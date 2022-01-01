<template>
	<div id="options_container">			
		<fieldset>
			<legend >{{$t('safeFirstTry')}}</legend>
			<label for="safe-try-radio-1" >{{$t('yes')}}</label>
			<input class="radio-opt" type="radio" name="radio-1" id="safe-try-radio-1" value="true" v-model="safeFirstTry" checked	>
			<label for="safe-try-radio-2">{{$t('no')}}</label>
			<input class="radio-opt" type="radio" name="radio-1" id="safe-try-radio-2" value="false" v-model="safeFirstTry"	>  
		</fieldset>			
		<fieldset>
			<legend >{{$t('animation')}}</legend>
			<label for="animation-1" >{{$t('yes')}}</label>
			<input class="radio-opt" type="radio" name="radio-2" id="animation-1" value="true" v-model="animation" checked	>
			<label for="animation-2">{{$t('no')}}</label>
			<input class="radio-opt" type="radio" name="radio-2" id="animation-2" value="false" v-model="animation"	>  
		</fieldset>			
		<fieldset>
			<legend>{{$t('gameLevel')}} </legend>	
			<div>						 
				<input type="radio" name="level-radio-2" id="level-radio-1" v-model="gameLevel" value="easy" checked >
				<label for="level-radio-1" >{{$t('easy')}}</label>
			</div>
			<div>
				<input type="radio" name="level-radio-2" id="level-radio-2" v-model="gameLevel" value="medium" >
				<label for="level-radio-2">{{$t('medium')}}</label>
			</div>
			<div>
				<input type="radio" name="level-radio-2" id="level-radio-3" v-model="gameLevel" value="hard" >  
				<label for="level-radio-3">{{$t('hard')}}</label>
			</div>
			<div>				
				<input type="radio" name="level-radio-2" id="level-radio-4" v-model="gameLevel" value="custom" >  
				<label for="level-radio-4">{{$t('custom')}}</label>
			</div>	
			<div id="game-level-options">	
				<div class="shelf">
					<label class="labelbox" for="level-text-width">{{$t('width')}}</label>
					<input class="valuebox" type="text" id="level-text-width"  @change='parseInput(gameOptionBoard.width,"width",3,30)' v-model="gameOptionBoard.width" v-bind:disabled='gameLevel!="custom"' >  
				</div>
				<div class="shelf">
					<label class="labelbox" for="level-text-height">{{$t('height')}}</label>
					<input class="valuebox"  type="text" id="level-text-height" @change='parseInput(gameOptionBoard.height,"height",3,30)' v-model.number="gameOptionBoard.height" v-bind:disabled='gameLevel!="custom"' >  	
				</div>
				<div class="shelf">
					<label class="labelbox" for="level-text-bombs">{{$t('bombs')}}</label>
					<input class="valuebox"  type="text" id="level-text-bombs"  @change='parseInput(gameOptionBoard.bombs,"bombs",1,300)' v-model.number="gameOptionBoard.bombs" v-bind:disabled='gameLevel!="custom"' >  
				</div>
			</div>					
		</fieldset>	  		
		<button @click='saveOpt'  id="saveButton" class="ui-checkboxradio-label ui-corner-all ui-button ui-widget ui-checkboxradio-radio-label ui-checkboxradio-checked ui-state-active" >{{$t('save')}}</button>
	</div>  
</template>

<script>

import $ from 'jquery'
import 'jquery-ui/ui/widgets/checkboxradio'
import 'jquery-ui/themes/base/all.css'

export default {
	
	name: 'options',
	
	data:function(){
		return {  
			safeFirstTry : true,
			animation : true,
			gameLevel : "easy",
			gameLevelValues : { 
				easy : { width : 8 , height : 8, bombs :10, }, 
				medium : { width : 16 , height : 16, bombs :40, }, 
				hard : { width : 31 , height : 16, bombs :99, }, 
				custom : { width : 15 , height : 30, bombs :50, }, 		
			},
			disabled : "disabled", 
			gameOptionBoard: { width : 8, height : 8, bombs : 10, },
		}	
	},	
   
	watch:{
		gameLevel(val){
				
			this.gameOptionBoard.width = this.gameLevelValues[val].width	
			this.gameOptionBoard.height = this.gameLevelValues[val].height
			this.gameOptionBoard.bombs = this.gameLevelValues[val].bombs
			
		},

		gameOptionBoard:{
			handler: function (val) {	
				if(this.gameLevel == 'custom'){					
					this.gameLevelValues.custom.width = val.width
					this.gameLevelValues.custom.height = val.height
					this.gameLevelValues.custom.bombs = val.bombs					
				}				
			},
			deep: true
		},	
	
	},	
  
	methods:{
	
		parseValueNumber(value,nan=3) {		
			value = `${value}`
			const parsed = Number.parseInt(value.replace(/[^0-9]/g, ''),10)
			if (Number.isNaN(parsed)) {
				return nan  
			}
			return parsed
		},
		
		parseInput(value,target,min=8,max=8){		
			value = this.parseValueNumber(value)
			if(value<min){
				this.gameOptionBoard[target] = min
			}
			else if(value>max){			
				this.gameOptionBoard[target] = max
			}		
			else{
				this.gameOptionBoard[target] = value	
			}	
		},	
		
		saveOpt(){	
			if(this.safeFirstTry == "true") this.$store.commit("board/setFirstClickBombFree",true)
			if(this.safeFirstTry == "false") this.$store.commit("board/setFirstClickBombFree",false)	
			if(this.animation == "true") this.$store.commit("board/setAnimation",true)
			if(this.animation == "false") this.$store.commit("board/setAnimation",false)				
			this.$store.commit("board/setBoardRows",this.gameOptionBoard.height)	
			this.$store.commit("board/setBoardCol",this.gameOptionBoard.width)	
			this.$store.commit("board/setBombs",this.gameOptionBoard.bombs)				
			this.$emit("saveOption")	
		}	
		
	},	
	
	mounted () {	
		$( function() {
			$( ".radio-opt" ).checkboxradio();
		
		});
	}
  
}
</script>

<style>
@import "~@/sass/options.scss";
</style>

