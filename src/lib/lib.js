function drawEmptyBoard(elementNumber){		
	let board = Array(elementNumber).fill(null).map((_, i) => {
	return {
		"id": i,
		"bomb": false,
		"flag": 0, // 1 flag, 2 question mark 
		"visible": false,
		"neighbourBombs": 0,
		"styleClass": [],		
	}
	})
	return board
}

function getListNeighbourElements(currentCell,boardRows,boardCol){	
	let cellList = []
	let currentRow = getCurrentRow(currentCell,boardCol)
	let currentCol = getCurrentCol(currentCell,boardRows,boardCol)			
	if( ((currentRow - 1) >= 0) && ((currentCol - 1) >= 0 ) ){		
		cellList.push( ((currentRow-1) * boardCol) + currentCol-1 )
	}	
	if( ((currentRow - 1) >= 0 ) ){		
		cellList.push(((currentRow-1) * boardCol) + currentCol)
	}	
	if( ((currentRow - 1) >= 0) && currentCol < (boardCol-1) ){			
		cellList.push(((currentRow-1) * boardCol) + currentCol + 1)
	}		
	if( (currentCol - 1) >= 0 ){		
		cellList.push(currentCell-1)
	}
	if( currentCol < (boardCol-1) ){	
		cellList.push(currentCell+1)
	}		
	if( ( currentRow < boardRows-1) &&  (currentCol - 1) >= 0 ){		
		cellList.push(((currentRow+1)*boardCol) + currentCol-1)	
	}		
	if(  currentRow < boardRows-1 ){	
		cellList.push( ((currentRow+1)*boardCol) + currentCol)	
	}	
	if( ( currentRow < boardRows-1)  &&  currentCol < (boardCol-1)  ){	
		cellList.push(((currentRow+1)*boardCol) + currentCol+1)	
	}	
	return cellList
}	

function getCurrentRow(currentCell,boardCol){
	if(currentCell == 0) return 0
	return Math.floor(currentCell/boardCol)	
}	

function getCurrentCol(currentCell,boardRows,boardCol){
	let currentRow = getCurrentRow(currentCell,boardCol)	
	return currentCell - (currentRow * boardCol)
}	

function getRandBombsPosition(boardSize,bombs,freeBombPositions=[]){              
	let bombPositions = []
	if((boardSize-freeBombPositions.length)<bombs){
		throw 'Can not calculate bomb position - getRandBombsPosition()';
	}
	while(bombPositions.length<bombs){
		let random = Math.floor(Math.random() * boardSize)   
		if( !bombPositions.includes(random) && !freeBombPositions.includes(random))       
		bombPositions.push(random)
	}
	return bombPositions
}

function addBombsToBoard(board={},bombs=[]){
	board.forEach(e => { 
		if( bombs.includes(e.id) ){ e.bomb=true } 
	}); 
	return board
}	

function getNumberBombsAroundCell(currentCell,boardRows,boardCol,board){
	let cellsList = getListNeighbourElements(currentCell,boardRows,boardCol)
	let neighbourBombs = 0	
	cellsList.forEach( (cellValue) => { 	
		if(board[cellValue].bomb == true){		
			neighbourBombs++
		}		
	})	
	return neighbourBombs
}	

function setBombsNumberToBoardCells(boardRows,boardCol,board){		
	board.forEach( (_,cellId) => {		
		if(board[cellId].bomb == false){			
			board[cellId].neighbourBombs = getNumberBombsAroundCell(board[cellId].id,boardRows,boardCol,board)
		}	
	})
	return board
}	

function shuffle_array(array){
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}	
	return array
}	

function getEmptyBoardCells(listCells,board,boardRows,boardCol){	
	let values = listCells.values()	
	let cell = null
	do{		
		cell = values.next().value
		if(typeof cell != 'undefined'){			
			if( board[cell].neighbourBombs>0 ){
				listCells.add(cell)
			}			
			else if( board[cell].visible == false && board[cell].flag == false && board[cell].bomb == false ){
				listCells.add(cell)			
				let listNeighbourElements = getListNeighbourElements(cell,boardRows,boardCol)
				listNeighbourElements.forEach( (index) => listCells.add(index)  )			
			}	
		}	
	}while(cell != null) 	
	return listCells
}	

export default { drawEmptyBoard, getListNeighbourElements, getRandBombsPosition, addBombsToBoard, setBombsNumberToBoardCells,getNumberBombsAroundCell,shuffle_array,getEmptyBoardCells }