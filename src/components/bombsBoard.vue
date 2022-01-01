<template>
	<div id="bomb-board-container">
		<time-menu/>		
		<transition-group name="cell" tag="div" id="bomb-board">				
			<div v-bind:class="getCellClass(cell)" @click.prevent="leftClickCell(cell.id)"  @click.right.prevent="rightClickCell(cell.id)" class="cell" v-for="cell in board" :key="forKey(cell.id)" >							
				<div v-if="cell.neighbourBombs>0 && cell.visible==true" >{{cell.neighbourBombs}}</div>		
			</div>		
		</transition-group>			
		<div id="bottom_buttons">
			<button @click="startGame">{{$t('startGame')}}</button>
			<button @click="resizeBoard()">{{ isBombBoardFullSize ? $t('normalSize'): $t('maximizeBoard')}}</button>				
		</div>
	</div>	
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions,mapMutations } = createNamespacedHelpers('board')
import timeMenu from './timeMenu.vue'
import $ from 'jquery'
import('jquery-ui/ui/widgets/resizable')
import('jquery-ui/themes/base/all.css')

export default {
	name: 'bombBoard',
	
	components:{
		timeMenu,	
	},	
  
	data:function(){    
		return {
		keyMod : true ,
		isActive : true, 
		bombBoardSize : {newHeight:0, orginalHeight:0, orginalWidth:0}, 		
		isBombBoardFullSize : false,		
		boardResize: {boardWidth: 0, boardRow : this.boardRow, boardCol : this.boardCol, isBombBoardFullSize : false }		
		}
	},
 
	beforeCreate() {
		this.$store.commit("board/calcBoardSize")			
	},
 
	created(){  			
		this.startGame()
		this.setElementsSize()					
	},	
	
	watch: {	

		boardResize:{
			handler: function (val) {		
				if(val.boardWidth == 0) return false				
				this.$store.commit("board/calcBoardSize")					
				let cellWidth = Math.floor(val.boardWidth / this.boardCol) 
				if(cellWidth<40) cellWidth = 40				
				let boardWidth = cellWidth * this.boardCol				
				let boardHeight = cellWidth * this.boardRow					
				this.setElementsSize(cellWidth,cellWidth)				
				$( "#bomb-board" ).css({width: boardWidth, height: boardHeight, minWidth: (this.boardCol * 40), minHeight: (this.boardRow * 40),  })					
			},
			deep: true
		},
		
		gameTriggerNextLevel(){
			this.isBombBoardFullSize = false
			this.$store.commit("board/calcBoardSize")			
			this.startGame()			
			this.setElementsSize()			
			this.boardResize.boardWidth = this.boardCol * 40			
			this.boardResize.boardRow = this.boardRow
			this.boardResize.boardCol = this.boardCol		
		},	
		
		
		gameTrigger(){					
			this.startGame()			
		}	
    },
	
	mounted() {
		this.$nextTick(function () {	  
			this.keyMod =!this.keyMod 			
		})		
		var that = this	
		$(document).ready(function(){			
			$("#bomb-board").resizable({
				aspectRatio: true,				
				resize: function(event, ui) {  				
					that.boardResize.boardWidth = ui.size.width			
					that.isBombBoardFullSize = false	
				}
			})			
			
		})	

	},	
	
	computed:{
		...mapState( {	
			board: state => state.board,
			boardRow: state => state.boardRows,
			boardCol: state => state.boardCol,	
			boardTransitionKeys: state => state.boardTransitionKeys,
			firstClickBombFree: state => state.firstClickBombFree,
			cellClickNumber: state => state.cellClickNumber,
			defaultLeftMouseButton: state => state.defaultLeftMouseButton,
			boardSize: state => state.boardSize,
			gameResult: state => state.gameResult,
			gameTrigger: state => state.gameTrigger,
			gameTriggerNextLevel: state => state.gameTriggerNextLevel,
			bombs: state => state.bombs,
			
			
		}),		
	},
  
	methods:{  
	
		...mapActions(['createBoard']),		
		
		...mapMutations(['setFirstClickBombFree','setGameActive']),			
	
		resizeBoard(){			
			var that = this	
			$(document).ready(function(){
				if(that.isBombBoardFullSize == false){
					let windowWidth = Math.floor( $( window ).width() - 30 )
					let bombBoardWidth = $("#bomb-board").width()
					let bombBoardHeight = $("#bomb-board").height()
					let ratio =  windowWidth /  bombBoardWidth			
					let newHeight = Math.ceil( bombBoardHeight * ratio )			
					$("#bomb-board").width(  windowWidth )
					$("#bomb-board").height(  newHeight )
					that.boardResize.boardWidth = windowWidth										
				}
				else{									
					that.boardResize.boardWidth = that.boardCol * 40							
				}					
				that.isBombBoardFullSize = !that.isBombBoardFullSize				
			})	
			
		},			
	
		forKey(id){			
			if(this.keyMod) return this.boardTransitionKeys[id]
			return id				
		},	
	
		leftClickCell(cellId){
			if( (this.board[cellId].visible == true  && this.board[cellId].flag == 0) || this.gameResult != 'unknow' ) return false
			if(this.defaultLeftMouseButton ==true){
				this.cellClick(cellId)
			}
			else{
				this.cellClickSetFlag(cellId)
			}	
			this.removeUnusedStages()			
			this.saveBoardStorage()		
		},
		
		rightClickCell(cellId){		
			if( (this.board[cellId].visible == true && this.board[cellId].flag == 0) || this.gameResult != 'unknow' ) return false
			if(this.defaultLeftMouseButton ==true){				
				this.cellClickSetFlag(cellId)
			}
			else{
				this.cellClick(cellId)				
			}
			this.removeUnusedStages()		
			this.saveBoardStorage()		
		},	
	
		cellClick(cellId){						
			if(this.board[cellId].flag != 0){				
				return false	
			}				
			if(this.cellClickNumber == 0){			
				if(this.firstClickBombFree == true){						
					this.createBoard(cellId)
					sessionStorage.clear()	
					this.saveBoardStorage()
				}	
				this.$store.commit("board/setGameActive",true)	
				this.$store.commit("board/setGameTime",{start:new Date().getTime(),end:null})	
			}
			this.$store.commit("board/setCellClickNumber",(this.cellClickNumber+1))	
			this.checkClickResult(cellId)	
			this.checkGameResult()				
		},			
		
		cellClickSetFlag(cellId){
			
			if(this.board[cellId].visible == true && this.board[cellId].flag == 0) return false			
			let flag = this.board[cellId].flag								
			if( flag<2 ){				
				flag++
			}		
			else{
				flag=0
			}			
			this.$store.commit('board/setCellFlag',{cellId,flag})	
			this.checkGameResult()
			this.countDiscoveredBombs()
		},
		
		countDiscoveredBombs(){
			let flagsNumber = 0
			this.board.forEach( (_,i) => {
				if( this.board[i].flag == 1 ){
					flagsNumber++
				}	
			})		
			let result = this.bombs - flagsNumber
			this.$store.commit('board/setDiscoveredBombsNumber',result)				
		},	
		
		checkGameResult(){
			let i = 0			
			while(i < this.boardSize){				
				if( this.board[i].visible==true){ 
					if(this.board[i].bomb==true){					
						this.$store.commit("board/setGameResult",'lost')	
						break
					}
				}	
				else if( !(this.board[i].bomb==true && (this.board[i].flag==1 || this.board[i].flag==2) ) ){				
					break
				}	
				i++
			}
			
			if( i==this.boardSize ){
				this.$store.commit("board/setGameResult",'win')
			}
			
		
			
		},	
		
		getCellClass(cell){
			let classList = []	
			if(cell.flag == 1){
				classList.push('cell-flag')
			}		
			else if(cell.flag == 2){
				classList.push('cell-question')
			}				
			else if(cell.visible == true){		
				if(cell.bomb == true){
					classList.push('cell-bomb')
				}	
				else if(cell.neighbourBombs == 0){
					classList.push('cell-empty')
				}
				else{	
					classList.push('cell-neighbour-bombs')	
					switch(cell.neighbourBombs){					
						case 1:
						classList.push('font-color-c1')
						break
						case 2:
						classList.push('font-color-c2')
						break
						case 3:
						classList.push('font-color-c3')
						break
						case 4:
						classList.push('font-color-c4')
						break
						case 5:
						classList.push('font-color-c5')
						break
						case 6:
						classList.push('font-color-c6')
						break
						case 7:
						classList.push('font-color-c7')
						break					
						default:				
						classList.push('font-color-c8')
					}	
				}				
			}
				
			if( cell.styleClass.length>0 )	classList = [...classList, ...cell.styleClass]		
			return classList	
		},	
		
		discoverHiddenBombs(){
			for(let i=0;i<this.boardSize;i++){
				if( this.board[i].bomb==true ){				
					let value = [...this.board[i].styleClass, ...['cell-bomb']]	
					let cellId = i	
					this.$store.commit('board/setBoardStyleClass',{cellId,value})		
				}	
			}			
		},	
		
		setFLagsToHiddenBombs(){
			let isBoardDiscovered = true
			let flag = 1
			for(let i=0;i<this.boardSize;i++){			
				if( this.board[i].visible == false && this.board[i].bomb == false ){
					isBoardDiscovered = false
					break
				}
			}	
			if(isBoardDiscovered){
				this.board.forEach( (_,i) => {
					if( this.board[i].bomb == true ){
						let cellId = i
						this.$store.commit('board/setCellFlag',{cellId,flag})	
					}	
				})
			}
			
		},	
		
		checkClickResult(cellId){
			if( this.board[cellId].bomb == true  ){
				this.$store.commit("board/setGameResult",'lost')	
				this.$store.commit("board/setCellVisible",cellId)							
				let value = [...this.board[cellId].styleClass, ...['cell-bomb-clicked']]				
				this.$store.commit('board/setBoardStyleClass',{cellId,value})	
				this.discoverHiddenBombs()	
				return false					
			}		
			else if(this.board[cellId].neighbourBombs>0){
				this.$store.commit("board/setCellVisible",cellId)
			}	
			else{				
				this.$store.commit("board/discoverBoardCells",cellId)		
			}	
			this.setFLagsToHiddenBombs()	
			this.countDiscoveredBombs()	
			
		},	
	
		startGame(){
			sessionStorage.clear()		
			this.$store.commit("board/setCellClickNumber",0)
			this.$store.commit("board/setBoardTransitionKeys")				
			if(this.$store.state.board.animation) this.keyMod =!this.keyMod			
			this.createBoard()			
			this.saveBoardStorage()				
		},	
	
		getStage(id=0){
			let stage = {} 
			stage["stageId"] = id
			stage["discoveredBombsNumber"] = this.$store.state.board.discoveredBombsNumber
			stage["gameResult"] = this.$store.state.board.gameResult				
			stage["board"] = this.$store.state.board.board
			return stage	
		},			
		
		saveBoardStorage(){		
			let stageArray = []		
			let stageArrayLength = 0			
			if (sessionStorage.getItem('savedGame') === null) {		
				stageArray.push(this.getStage())
				sessionStorage.setItem('savedGame',JSON.stringify(stageArray))	
				this.$store.commit("board/setCurrentGameStage",0)	
			}
			else{
				stageArray = JSON.parse(sessionStorage.getItem('savedGame'))
				stageArrayLength = Object.keys(stageArray).length
				let stage = this.getStage( stageArrayLength )
				stageArray.push(stage)				
				sessionStorage.setItem('savedGame', JSON.stringify(stageArray) )
				this.$store.commit("board/setCurrentGameStage",stageArrayLength)
			}				
			this.$store.commit("board/setSavedGameLength",stageArrayLength+1)			
		},		
		
		removeUnusedStages(){	
			if( this.$store.state.board.savedGameLength  == (this.$store.state.board.currentGameStage+1)) return false		
			let stageArray = JSON.parse(sessionStorage.getItem('savedGame'))			
			let removedStagesNumber = this.$store.state.board.currentGameStage+1		
			let newStageArray = stageArray.slice(0,removedStagesNumber)				
			this.$store.commit("board/setSavedGameLength",newStageArray.length)
			sessionStorage.setItem('savedGame', JSON.stringify(newStageArray) )			
		},	
		
		setProperty(variable,value){
			return document.documentElement.style.setProperty(variable, value)
		},
		
		setElementsSize(cellWidth=40,cellHeight=40){		
			let boardHeight = cellHeight * this.boardRow
			let boardWidth = cellWidth * this.boardCol
			let fontSize
			if(cellHeight<45){ 
				fontSize = Math.ceil(cellWidth*0.8)
			}
			else {
				fontSize = Math.ceil(cellWidth*0.5)
			}			
			this.setProperty('--cell-width', cellWidth+'px')
			this.setProperty('--cell-height', cellHeight+'px')
			this.setProperty('--board-heigh', boardHeight+'px')
			this.setProperty('--board-width', boardWidth+'px')			
			this.setProperty('--board-font-size',fontSize +'px')
		},
 
	},  
}

</script>