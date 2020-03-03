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
        /*
        var myGrid = document.getElementById("sudokugrid");
        for(var i = 0; i < 9; i++){
            for(var j = 0; j < 9; j++){
                myGrid.rows[i].cells[j].onmouseup = this.bindEvent(myGrid.rows[i].cells[j], i, j);
            }
        }*/
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
                this.grid[this.selectedRow][this.selectedCol].insertNum(key - 48);
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

    generateDefault(){
        this.grid[0][1].insertNum(4);
        this.grid[0][6].insertNum(8);
        this.grid[1][0].insertNum(6);
        this.grid[1][3].insertNum(3);
        this.grid[1][4].insertNum(2);
        this.grid[2][0].insertNum(1);
        this.grid[2][5].insertNum(8);
        this.grid[2][6].insertNum(2);
        this.grid[3][3].insertNum(1);
        this.grid[3][6].insertNum(9);
        this.grid[3][8].insertNum(7);
        this.grid[4][1].insertNum(7);
        this.grid[4][4].insertNum(9);
        this.grid[4][7].insertNum(5);
        this.grid[5][0].insertNum(2);
        this.grid[5][2].insertNum(9);
        this.grid[5][5].insertNum(6);
        this.grid[6][2].insertNum(1);
        this.grid[6][3].insertNum(4);
        this.grid[6][8].insertNum(8);
        this.grid[7][4].insertNum(1);
        this.grid[7][5].insertNum(5);
        this.grid[7][5].insertNum(3);
        this.grid[8][2].insertNum(7);
        this.grid[8][7].insertNum(2);
    }
}

function loadTable(){
    this.grid = new SudokuGrid();
    this.gridData = this.grid.renderGrid();
    //document.getElementById("grid").innerHTML = gridData;
    this.grid.clickCell();
}

function inputKey(event) {
    var keyEvent = event.which || event.keyCode;
    this.grid.inputKey(keyEvent);
}

function clearGrid(){
    this.grid.clearGrid();
    this.grid.clearStatus();
}

function generateDefault(){
    this.grid.generateDefault();
    this.grid.clearStatus();
}

function revert(){
    this.grid.revert();
    this.grid.clearStatus();
}

function runAlgo(type){
    var cp = new CheckPuzzle(this.grid.grid);
    this.grid.clearStatus();
    if(cp.checkPuzzle() == 0){
        return;
    }
    var algorithm;
    switch(type){
        case 1: algorithm = new BruteForce(); break;
    }
    algorithm.solvePuzzle(this.grid.grid);
}

function validateSolution(){
    var cp = new CheckPuzzle(this.grid.grid);
    this.grid.clearStatus();
    if(cp.validatePuzzle() == 0){
        return;
    }
}

function allowDrag(ev) {
    ev.preventDefault();
}