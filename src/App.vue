<template>
	<div id="app" v-bind:class="{blue_theme:themeSwitcher, animate:animation, }">  
		<div id="menu_options_container">  
			<top-menu @changeTheme="changeTheme()" @switchOptionComponent="switchOptionComponent()" :class='{options:optionComponent}' :currentMainComponent = "currentMainComponent.name" />	
			<keep-alive>
				<component v-bind:is=currentMainComponent @saveOption="saveOption()" ></component>
			</keep-alive>
		<div id="gamelink"><a href = "https://randwords.com/coronasweeper/"> Coronasweeper</a> by <a href="https://github.com/darendev/coronasweeper">Darendev</a></div>		
		</div>		
	</div> 
</template>

<script>
import bombsBoard from './components/bombsBoard.vue'
import topMenu from './components/topMenu.vue'
import options from './components/options.vue'
import $ from 'jquery'
import 'jquery-ui/ui/widgets/resizable'
import 'jquery-ui/ui/widgets/tooltip'
import 'jquery-ui/themes/base/all.css'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('board')

export default {
	
	name: 'App',
	components: {   
		bombsBoard,	
		topMenu,
		options,	
	},
	
	data:function(){	
		return {  
			themeSwitcher : true,
			optionComponent:false, 
			currentMainComponent:bombsBoard 
		}
	},	
	
	computed:{	
		...mapState( {	
			gameTrigger: state => state.gameTrigger,	
			lastClickedCellId: state => state.lastClickedCellId,	
			board: state => state.board,   	
			animation: state =>state.animation	
		}),	
	},	
	
	methods:{		
		...mapMutations(['setFirstClickBombFree','setGameTrigger','setNewBoard']),	
		
		changeTheme(){
			this.themeSwitcher = !this.themeSwitcher
		},
	
		switchOptionComponent(){				
			if( this.optionComponent == false ){
				this.currentMainComponent = options			
			}
			else{
				this.currentMainComponent = bombsBoard
			}	
			this.optionComponent = !this.optionComponent		
		},	
	
		saveOption(){
			this.switchOptionComponent()
			this.$store.commit("board/setGameTriggerNextLevel",!this.$store.state.board.gameTriggerNextLevel)	
		},		
		
	},	

	mounted(){
		$( function() {
			$( document ).tooltip({
				position: {
					my: "center bottom-20",
					at: "center top",
					using: function( position, feedback ) {
						$( this ).css( position );
						$( "<div>" )
							.addClass( "arrow" )
							.addClass( feedback.vertical )
							.addClass( feedback.horizontal )
							.appendTo( this );
						}
					}
				});
			} );  

		},
  
	}
</script>

<style lang="scss">
@import "~@/sass/bomb-board.scss";
@import "~@/sass/top-menu.scss";
#gamelink{
	margin-top:20px;
	font-size: small;
}
#gamelink a{
	color: #42b983;
}
</style>


