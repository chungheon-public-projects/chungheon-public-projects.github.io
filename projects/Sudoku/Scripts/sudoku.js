class SudokuGrid{
    constructor(){
        this.grid = this.getGrid();
        this.selectedRow = -1;
        this.selectedCol = -1;
    }

    getGrid(){
        var myGrid = [];
        for(var row = 0; row < 9; row++){
            var currentRow = [];
            for(var col = 0; col < 9; col++){
                var node = new Node(row, col);
                currentRow.push(node);
            }
            myGrid.push(currentRow);
        }
        return myGrid;
    }

    renderGrid(){
        /*var myGrid = "<table id=\"sudokugrid\">"
        
        for(var i = 0; i < 9; i++){
            myGrid += "<tr>";
            for(var j = 0; j < 9; j++){
                myGrid += this.grid[i][j].render();
            }
            myGrid += "</tr>";
        }
        myGrid += "</table>";

        return myGrid;*/
        var rowGrid = document.getElementById("row1");
        var gridHtml = "";
        for(var k = 0; k < 3; k++){
            gridHtml += "<div class=\"minigrid\"> <table>";
            for(var i = 0; i < 3; i++){
                gridHtml += "<tr>";
                for(var j = 0; j < 3; j++){
                    gridHtml += this.grid[i][k * 3 + j].render();
                }
                gridHtml += "</tr>";
            }
            gridHtml += "</table></div>";
        }
        rowGrid.innerHTML = gridHtml;

        rowGrid = document.getElementById("row2");
        gridHtml = "";
        for(var k = 0; k < 3; k++){
            gridHtml += "<div class=\"minigrid\"> <table>";
            for(var i = 3; i < 6; i++){
                gridHtml += "<tr>";
                for(var j = 0; j < 3; j++){
                    gridHtml += this.grid[i][k * 3 + j].render();
                }
                gridHtml += "</tr>";
            }
            gridHtml += "</table></div>";
        }
        rowGrid.innerHTML = gridHtml;

        rowGrid = document.getElementById("row3");
        gridHtml = "";
        for(var k = 0; k < 3; k++){
            gridHtml += "<div class=\"minigrid\"> <table>";
            for(var i = 6; i < 9; i++){
                gridHtml += "<tr>";
                for(var j = 0; j < 3; j++){
                    gridHtml += this.grid[i][k * 3 + j].render();
                }
                gridHtml += "</tr>";
            }
            gridHtml += "</table></div>";
        }
        rowGrid.innerHTML = gridHtml;
    }

    /*defaultVal(){
        for(var i = 0; i < 9; i++){
            for(var j = 0; j < 9; j++){
                this.grid[i][j].insertNum(i + 1);
            }
        }
    }*/

    clickCell() {
        for(var i = 0; i < 9; i++){
            for(var j = 0; j < 9; j++){
                this.grid[i][j].bindClick(this);
            }
        }
    }

    bindEvent(cell, i ,j){
        var su = this;
        cell.addEventListener('mouseup', e => {
            su.nodeEnter(i, j);
        });
    }

    nodeEnter(i, j){
        this.clearSelected();
        this.grid[i][j].selected();
        this.selectedRow = i;
        this.selectedCol = j;
    }
    
    clearSelected() {
        if(this.selectedCol != -1 && this.selectedRow != -1){
            this.grid[this.selectedRow][this.selectedCol].unselect();
        }
        this.selectedCol = -1;
        this.selectedRow = -1;    
    }

    inputKey(key){
        if(key >= 48 && key < 58){
            if(this.selectedCol != -1 && this.selectedRow != -1){
                this.clearStatus();
                this.grid[this.selectedRow][this.selectedCol].insertNum(key - 48);
                valid.checkQuestion(this.grid);
            }
        }
    }
    
    clearGrid(){
        for(var i = 0; i < 9; i++){
            for(var j = 0; j < 9; j++){
                this.grid[i][j].insertNum(0);
            }
        }
    }

    revert(){
        for(var i = 0; i < 9; i++){
            for(var j = 0; j < 9; j++){
                if(this.grid[i][j].base == 0){
                    this.grid[i][j].insertNum(0);
                }
            }
        }
    }

    clearStatus(){
        for(var i = 0; i < 9; i++){
            for(var j = 0; j < 9; j++){
                    this.grid[i][j].clearStatus();
            }
        }
    }
}

function loadTable(){
    this.grid = new SudokuGrid();
    this.gridData = this.grid.renderGrid();
    this.grid.clickCell();
    this.valid = new CheckPuzzle();
    this.running = 0;
}

function inputKey(event) {
    var keyEvent = event.which || event.keyCode;
    this.grid.inputKey(keyEvent);
}

function clearGrid(){
    if(this.running != 1){
        this.grid.clearGrid();
        this.grid.clearStatus();
    }
}

function generateDefault(){
    if(this.running != 1){
        blockRun();
        this.grid.clearGrid();
        var generate = new GenerateAlgo(this.grid.grid);
        generate.generatePuzzle();
        this.grid.grid = generate.grid;
        this.grid.clearStatus();
    }
}

function clearSolutions(){
    this.grid.revert();
    this.grid.clearStatus();
}

function revert(){
    if(this.running != 1){
        this.grid.revert();
        this.grid.clearStatus();
    }
}

function runAlgo(type){
    if(this.running == 1){
        return;
    }
    this.grid.clearStatus();
    blockRun();
    if(!this.valid.checkQuestion(this.grid.grid)){
        return;
    }

    var algo;
    switch(type){
        case 1: algo = new BruteForce(this.grid.grid);
    }
    algo.recursiveSolvePrep(0);
    this.grid.grid = algo.grid;
}

function solveInstant(type){
    if(this.running == 1){
        return;
    }
    this.grid.clearStatus();
    if(!this.valid.checkQuestion(this.grid.grid)){
        return;
    }

    var algo;
    switch(type){
        case 1: algo = new BruteForce(this.grid.grid);
    }
    algo.recursiveSolvePrep(2);
    this.grid.grid = algo.grid;
}

function validateSolution(){
    if(this.running == 1){
        return;
    }
    this.valid.checkPuzzle(this.grid.grid);
}

function allowDrag(ev) {
    ev.preventDefault();
}

function blockRun(){
    this.running = 1;
}

function unblockRun(){
    this.running = 0;
}