import lib from '../lib/lib.js'

const state = {	
	boardRows:8,
	boardCol: 8,
	boardSize:  64,
	bombs: 10,	
	board: [],	
	firstClickBombFree: true,	
	boardTransitionKeys: [],	
	cellClickNumber: 0, 
	defaultLeftMouseButton:true, 
	gameResult: 'unknow',	
	gameActive: false,	
	gameTrigger:true,
	gameTriggerNextLevel:true,
	gameTime:{start:'',end:''},
	discoveredBombsNumber: 0,
	animation:true,
	currentGameStage: null, 
	savedGameLength:0,	
};

const mutations = {	
	
	setBoard(state,value){		
		state.board = value		
	},
	
	setCurrentGameStage(state,value){		
		state.currentGameStage = value		
	},
	
	setSavedGameLength(state,value){		
		state.savedGameLength = value		
	},	
	
	setBoardRows(state,value){		
		state.boardRows = value		
	},
	
	setBoardCol(state,value){		
		state.boardCol = value		
	},
	
	setBombs(state,value){		
		state.bombs = value		
	},

	calcBoardSize(state){
		state.boardSize = state.boardRows * state.boardCol
	},		

	drawEmptyBoard(state){					
		state.board = lib.drawEmptyBoard(state.boardSize)
	},
	
	addBombsToBoard(state,freeBombPositions){			
		let bombList = []
		try{
			bombList = lib.getRandBombsPosition(state.boardSize,state.bombs,freeBombPositions) 
		}catch (e) {
			bombList = [0]		
			console.error(e);  
		}			
		state.board = lib.addBombsToBoard(state.board, bombList)
	},	
	
	setFirstClickBombFree(state,value){
		state.firstClickBombFree = value	
	},	

	setGameTrigger(state,value){		
		state.gameTrigger = value		
	},
	
	setDefaultLeftMouseButton(state,value){		
		state.defaultLeftMouseButton = value		
	},
	
	
	setAnimation(state,value){		
		state.animation = value		
	},	
	
	setGameTriggerNextLevel(state,value){		
		state.gameTriggerNextLevel = value		
	},
	
	setBombsNumberToBoardCells(state){
		state.board = lib.setBombsNumberToBoardCells(state.boardRows,state.boardCol,state.board)	
	},	
	
	setBoardTransitionKeys(state){
		state.boardTransitionKeys = lib.shuffle_array(Array(state.boardSize).fill(null).map((_, i) =>  i ))
	},	
	
	setCellClickNumber(state,value){
		state.cellClickNumber = value
	},
	
	setCellVisible(state,id){
		state.board[id].visible = true	
	},	
	
	setBoardStyleClass(state,{cellId,value}){		
		state.board[cellId].styleClass = value
	},	
	
	
	setGameResult(state,value){
		state.gameResult = value
	},	
	
	setGameActive(state,value){
		state.gameActive = value	
	},	
	
	setCellFlag(state,{cellId,flag}){		
		state.board[cellId].flag = flag
	},	
	
	setGameTime(state,{start,end}){			
		if(start != null) state.gameTime.start = start
		if(end != null) state.gameTime.end = end
	},		
	
	setDiscoveredBombsNumber(state,value){
		state.discoveredBombsNumber = value		
	},		
	
	discoverBoardCells(state,cellId){		
		let listCells = new Set();		
		listCells.add(cellId)		
		let emptyBoardCells = lib.getEmptyBoardCells(listCells,state.board,state.boardRows,state.boardCol)
		emptyBoardCells = Array.from(emptyBoardCells);			
		emptyBoardCells.forEach( (index)=>{state.board[index].visible=true} )
	}		
}

const actions = {
	createBoard({state,commit},cellId){		
		let freeBombPositions = []	
		if( Number.isInteger(cellId)  ){			
			commit('setGameActive',true)		
			if( state.firstClickBombFree == true && state.cellClickNumber == 0 ){
				freeBombPositions = lib.getListNeighbourElements(cellId,state.boardRows,state.boardCol)
				freeBombPositions.push(cellId)			
			}		
		}		
		commit("calcBoardSize")
		commit("drawEmptyBoard")
		commit("addBombsToBoard",freeBombPositions)			
		commit('setBombsNumberToBoardCells')		
		commit('setGameActive',false)
		commit('setGameResult','unknow')		
		commit('setDiscoveredBombsNumber',state.bombs)
		commit('setCurrentGameStage',null)
		sessionStorage.clear()	
	},	

}

export default {  
namespaced: true,
  state,
  mutations,
  actions,  
}; 