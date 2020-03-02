class BruteForce{
    constructor(){
        this.grid = [];
        this.emptyNodes = [];
    }
    solvePuzzle(grid){
        this.grid = grid;
        for(var i = 0; i < grid.length; i++){
            for(var j = 0; j < grid[grid.length - 1].length; j++){
                if(grid[i][j].number == 0){
                    this.emptyNodes.push(grid[i][j]);
                }
            }
        }
        var solved = 0;
        if(this.emptyNodes.length == 0){
            return;
        }
        
        var walker = 0;
        var count = 0;
        while(solved == 0){
            var currNode = this.emptyNodes[walker];
            var checkValid = currNode.number + 1;
            if(this.checkValid(checkValid, currNode) == 1 && checkValid != 10){
                this.emptyNodes[walker].animInsert(checkValid, count);
                this.grid[currNode.rowNum][currNode.colNum].number = checkValid;
                walker++;
                count++;
            }else if(checkValid == 10){
                this.emptyNodes[walker].animInsert(0, count);
                this.grid[currNode.rowNum][currNode.colNum].number = 0;
                walker--;
                count--;
            }else{
                this.emptyNodes[walker].number++;   
            }
            
            if(walker == this.emptyNodes.length){
                solved = 1;
            }
        }
        setTimeout(this.clearSelected, (count + 1) * 100);
        
    }

    clearSelected(){
        var curr = document.getElementsByClassName("currentNode");
        for(var e of curr){
                e.classList.remove("currentNode");
        }
    }

    checkValid(checkNum, emptyNode){
        for(var i = 0; i < 9; i++){
            if(this.grid[emptyNode.rowNum][i].number == checkNum){
                return 0;
            }

            if(this.grid[i][emptyNode.colNum].number == checkNum){
                return 0;
            }
        }
        
        if(this.checkBox(checkNum, emptyNode.rowNum, emptyNode.colNum) == 0){
            return 0;
        }   

        return 1;
    }

    checkBox(checkNum, rowNum, colNum){
        var baseRow = -1;
        var baseCol = -1;
        if(rowNum < 3){
            baseRow = 0;
        }else if(rowNum < 6){
            baseRow = 3;
        }else{
            baseRow = 6;
        }

        if(colNum < 3){
            baseCol = 0;
        }else if(colNum < 6){
            baseCol = 3;
        }else{
            baseCol = 6;
        }

        var temp = baseCol;
        for(var i = 0; i < 3; i++){
            for(var j = 0; j < 3; j++){
                if(checkNum == this.grid[baseRow][baseCol].number){
                    return 0;
                }
                baseCol++;
            }
            baseRow++;
            baseCol = temp;
        }

        return 1;
    }
}

class CheckPuzzle{
    constructor(grid){
        this.grid = grid;
        this.puzzleNodes = [];
    }

    validatePuzzle(){
        var check = 1;
        for(var i = 0; i < 9; i++){
            for(var j = 0; j < 9; j++){
                if(this.grid[i][j].number != 0){
                    this.puzzleNodes.push(this.grid[i][j]);
                }else{
                    this.grid[i][j].invalid();
                }
            }
        }
        if(this.puzzleNodes.length != 81){
            check = 0;
        }
        for(var node of this.puzzleNodes){
            if(this.validateCheck(node.number, node) == 0){
                console.log("entered");
                check = 0;
            }
        }

        return check;
    }

    validateCheck(checkNum, currNode){
        var check = 1;
        for(var i = 0; i < 9; i++){
            if(this.grid[currNode.rowNum][i].number == checkNum && i != currNode.colNum){
                this.grid[currNode.rowNum][i].invalid();
                check = 0;
            }
            
            if(this.grid[i][currNode.colNum].number == checkNum && i != currNode.rowNum){
                this.grid[i][currNode.colNum].invalid();
                check = 0;
            }
        }
        
        if(this.validateBox(checkNum, currNode.rowNum, currNode.colNum) == 0){
            console.log("entered 2");
           check = 0;
        }   

        return check;
    }

    validateBox(checkNum, rowNum, colNum){
        var baseRow = -1;
        var baseCol = -1;
        var check = 1;
        if(rowNum < 3){
            baseRow = 0;
        }else if(rowNum < 6){
            baseRow = 3;
        }else{
            baseRow = 6;
        }

        if(colNum < 3){
            baseCol = 0;
        }else if(colNum < 6){
            baseCol = 3;
        }else{
            baseCol = 6;
        }

        var temp = baseCol;
        for(var i = 0; i < 3; i++){
            for(var j = 0; j < 3; j++){
                if(checkNum == this.grid[baseRow][baseCol].number && baseRow != rowNum && baseCol != colNum){
                    this.grid[baseRow][baseCol].invalid();
                    check = 0;
                }
                baseCol++;
            }
            baseRow++;
            baseCol = temp;
        }

        return check;
    }

    checkPuzzle(){
        var check = 1;
        for(var i = 0; i < 9; i++){
            for(var j = 0; j < 9; j++){
                if(this.grid[i][j].number != 0){
                    this.puzzleNodes.push(this.grid[i][j]);
                }
            }
        }
        if(this.puzzleNodes.length == 81){
            return 0;
        }
        for(var node of this.puzzleNodes){
            if(this.checkValid(node.number, node) == 0){
                check = 0;
            }
        }

        return check;
    }

    checkValid(checkNum, currNode){
        var check = 1;
        for(var i = 0; i < 9; i++){
            if(this.grid[currNode.rowNum][i].number == checkNum && i != currNode.colNum){
                this.grid[currNode.rowNum][i].invalid();
                check = 0;
            }
            
            if(this.grid[i][currNode.colNum].number == checkNum && i != currNode.rowNum){
                this.grid[i][currNode.colNum].invalid();
                check = 0;
            }
        }
        
        if(this.checkBox(checkNum, currNode.rowNum, currNode.colNum) == 0){
            check = 0;
        }   

        return check;
    }

    checkBox(checkNum, rowNum, colNum){
        var baseRow = -1;
        var baseCol = -1;
        var check = 1;
        if(rowNum < 3){
            baseRow = 0;
        }else if(rowNum < 6){
            baseRow = 3;
        }else{
            baseRow = 6;
        }

        if(colNum < 3){
            baseCol = 0;
        }else if(colNum < 6){
            baseCol = 3;
        }else{
            baseCol = 6;
        }

        var temp = baseCol;
        for(var i = 0; i < 3; i++){
            for(var j = 0; j < 3; j++){
                if(checkNum == this.grid[baseRow][baseCol].number && baseRow != rowNum && baseCol != colNum){
                    this.grid[baseRow][baseCol].invalid();
                    check = 0;
                }
                baseCol++;
            }
            baseRow++;
            baseCol = temp;
        }

        return check;
    }
}