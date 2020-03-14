var check, check2;

class GenerateAlgo {
    constructor(grid) {
        this.grid = grid;
        this.available = [];
        this.recCount = 0;
    }

    animPuzzleGen(){
        this.brute = new BruteForce(this.grid);
        var gen = this;
        this.brute.generateRandomComplete();
        this.grid = this.brute.grid;
        var noHole = Math.floor(Math.random() * 10) + 54;
        for(var r of this.grid){
            for(var c of r){
                this.available.push(c);
            }
        }

        this.tryRemove(noHole, 5, gen);

    }

    tryRemove(noHole, count, gen){
        if(noHole == 0){
            unblockRun();
            return;
        }
        var randIdx = Math.floor(Math.random() * gen.available.length);
        var randNode = gen.available[randIdx];
        var temp = randNode.number;
        gen.grid[randNode.rowNum][randNode.colNum].insertNum(0);
        gen.recCount++;
        if(gen.brute.numSolutions(gen.grid)){
            gen.available.splice(randIdx, 1);
            setTimeout(gen.tryRemove, gen.recCount * 1, noHole - 1, gen.available.length, gen);
        }else if(count == 0){
            gen.grid[randNode.rowNum][randNode.colNum].insertNum(temp);
            setTimeout(gen.tryRemove, gen.recCount * 1, noHole - 1, gen.available.length, gen);
        }else{
            gen.grid[randNode.rowNum][randNode.colNum].insertNum(temp);
            setTimeout(gen.tryRemove, gen.recCount * 1, noHole, count - 1, gen);
        }
    }

    generatePuzzle() {
        blockRun();
        var brute = new BruteForce(this.grid);
        brute.generateRandomComplete();
        this.grid = brute.grid;
        var noHole = Math.floor(Math.random() * 10) + 54;
        var available = [];
        for(var r of this.grid){
            for(var c of r){
                available.push(c);
            }
        }

        for(var hole = 0; hole < noHole; hole++){
            var randIdx = Math.floor(Math.random() * available.length);
            var randNode = available[randIdx];
            var temp = randNode.number;
            this.grid[randNode.rowNum][randNode.colNum].setNum(0);
            var count = 0;
            while(!brute.numSolutions(this.grid)){
                this.grid[randNode.rowNum][randNode.colNum].insertNum(temp);
                randIdx = Math.floor(Math.random() * available.length);
                randNode = available[randIdx];
                temp = randNode.number;
                this.grid[randNode.rowNum][randNode.colNum].insertNum(0);
                if(count == 5){
                    break;
                }
                count++;
            }
            available.splice(randIdx, 1);
        }

        unblockRun();
    }

}

class BruteForce {
    constructor(grid) {
        this.grid = grid;
        this.emptyNodes = [];
        this.recCount = 0;
        this.testWalk = 0;
        this.solutions = 0;
    }
    
    numSolutions(grid){
        this.grid = grid;
        this.emptyNodes = [];
        this.numSolutionsPrep();
        clearSolutions();
        if(this.solutions > 1 || this.solutions == 0){
            this.solutions = 0;
            return false;
        }
        this.solutions = 0;
        return true;

    }
    numSolutionsPrep(){
        for(var y = 0; y < this.grid.length; y++){
            for(var x = 0; x < this.grid[y].length; x++){
                if(this.grid[y][x].number == 0){
                    this.emptyNodes.push(this.grid[y][x]);
                }
            }
        }

        this.findSolutions(0);
    }

    findSolutions(walker){
        if(walker == this.emptyNodes.length){
            return true;
        }


        var currNode = this.emptyNodes[walker];
        var possible = this.getPossiblities(this.grid, this.grid[currNode.rowNum][currNode.colNum]);
        for(var p of possible){
            if(this.checkPossible(currNode, p)){
                this.recCount++;
                this.grid[currNode.rowNum][currNode.colNum].setNum(p, this.recCount);
                if(this.findSolutions(walker + 1)){
                    this.solutions += 1;
                    if(walker != 0){
                        this.grid[currNode.rowNum][currNode.colNum].setNum(0);
                    }
                }
            }
        }
        if(this.solutions <= 1){
            this.grid[currNode.rowNum][currNode.colNum].setNum(0);
        }
        return false;
    }

    //if type = 0, animate solve; as part of solution. 
    //if type = 1, set number as part of new puzzle. 
    //if type = 2, set number as part of solution
    recursiveSolvePrep(type){
        for(var y = 0; y < this.grid.length; y++){
            for(var x = 0; x < this.grid[y].length; x++){
                if(this.grid[y][x].number == 0){
                    if(type == 1){
                        this.emptyNodes.push(this.grid[y][x]);
                    }
                    else{
                        var possible = this.getPossiblities(this.grid, this.grid[y][x]);
                        if(possible.length == 1){
                            switch(type){
                                case 0: this.emptyNodes.push(this.grid[y][x]); 
                                        break;
                                case 2: this.grid[y][x].setNum(possible[0]);
                                        break;
                            }
                        }else{
                            this.emptyNodes.push(this.grid[y][x]); 
                        }
                    }
                }
            }
        }

        if(this.emptyNodes.length == 0){
            unblockRun();
            return true;
        }

        //Unable to find solution then remove attempt
        if(!this.recursiveSolve(0, type)){
            revert();
        }

        if(type == 0){
            setTimeout(this.clearSelected, this.recCount * 10);
        }
    }

    //if type = 0, animate solve; as part of solution. 
    //if type = 1, set number as part of new puzzle. 
    //if type = 2, set number as part of solution
    recursiveSolve(walker, type){
        if(walker == this.emptyNodes.length){
            return true;
        }

        var currNode = this.emptyNodes[walker];
        var possible = this.getPossiblities(this.grid, currNode);
        if(type == 1){
            this.shuffleArray(possible);
        }
        for(var p of possible){
            if(this.checkPossible(this.emptyNodes[walker], p)){
                switch(type){
                    case 0: this.grid[currNode.rowNum][currNode.colNum].animInsert(p, this.recCount);
                            this.recCount++;
                            break;
                    case 1: this.grid[currNode.rowNum][currNode.colNum].insertNum(p);
                            break;
                    case 2: this.grid[currNode.rowNum][currNode.colNum].setNum(p);
                            break;
                }
                if(this.recursiveSolve(walker + 1, type)){
                    return true;
                }
            }
        }

        switch(type){
            case 0: this.grid[currNode.rowNum][currNode.colNum].animInsert(0, this.recCount);
                    this.recCount++;
                    break;
            case 1: this.grid[currNode.rowNum][currNode.colNum].insertNum(0);
                    break;
            case 2: this.grid[currNode.rowNum][currNode.colNum].setNum(0);
                    break;
        }
        return false;
    }

    generateRandomComplete(){
        this.recursiveSolvePrep(1);
    }

    clearSelected(){
        var lastNode = document.getElementsByClassName('currentNode');
        for(var node of lastNode){
            node.classList.remove('currentNode');
        }
        unblockRun();
    }

    checkPossible(currNode, val) {
        for (var i = 0; i < this.grid.length; i++) {
            if (this.grid[i][currNode.colNum].number == val) {
                return false;
            }
            if (this.grid[currNode.rowNum][i].number == val) {
                return false;
            }
        }

        var rowStart = Math.floor(currNode.rowNum / 3) * 3;
        var colStart = Math.floor(currNode.colNum / 3) * 3;

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.grid[rowStart + i][colStart + j].number == val) {
                    return false;
                }
            }
        }

        return true;
    }

    getPossiblities(grid, currNode) {
        var possibleNumRow = [];
        var map = new Map([[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0]]);
        for (var i = 0; i < grid.length; i++) {
            if (grid[i][currNode.colNum].number != 0) {
                map.set(grid[i][currNode.colNum].number, 1);
            }
            if (grid[currNode.rowNum][i].number != 0) {
                map.set(grid[currNode.rowNum][i].number, 1);
            }
        }

        var rowStart = Math.floor(currNode.rowNum / 3) * 3;
        var colStart = Math.floor(currNode.colNum / 3) * 3;

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (grid[rowStart + i][colStart + j].number != 0) {
                    map.set(grid[currNode.rowNum][i].number, 1);
                }
            }
        }

        for (var keySet of map) {
            if (keySet[1] == 0) {
                possibleNumRow.push(keySet[0]);
            }
        }

        return possibleNumRow;
    }

    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    /*
    //Non-Recursive Method
    solvePuzzle(mode) {
        var count = 1;
        for(var y = 0; y < this.grid.length; y++){
            for(var x = 0; x < this.grid[y].length; x++){
                if(this.grid[y][x].number == 0){
                    var possible = this.getPossiblities(this.grid, this.grid[y][x]);
                    if(possible.length == 1){
                        this.grid[y][x].animInsert(possible[0], count);
                        count++;
                    }else{
                        this.grid[y][x].possible = possible;
                        this.grid[y][x].walker = 0;
                        this.emptyNodes.push(this.grid[y][x]);
                    }
                }
            }
        }

        if(this.emptyNodes.length == 0){
            return false;
        }
        var solved = 0;
        var walker = 0;
        var valWalk;
        while(solved == 0){
            var currNode = this.emptyNodes[walker];
            for(valWalk = currNode.walker; valWalk < currNode.possible.length; valWalk++){
                if(this.checkPossible(currNode, currNode.possible[valWalk])){
                    count++;
                    walker++;
                    currNode.walker = valWalk + 1;
                    this.grid[currNode.rowNum][currNode.colNum].animInsert(currNode.possible[valWalk], count);
                    break;
                }
            }

            if(valWalk >= currNode.possible.length){
                if(mode == 1){
                    count--; 
                }else{
                    count++;
                }
                walker--;
                currNode.walker = 0;
                currNode.number = 0;
                this.grid[currNode.rowNum][currNode.colNum].animInsert(0, count);
            }

            if(walker == this.emptyNodes.length){
                solved = 1;
            }

            if(walker == -1){
                return false;
            }
        }

        this.lastNode = this.emptyNodes[this.emptyNodes.length - 1];

        setTimeout(this.clearSelected, count * 10);
        
        return true;
    }

    solveInstantly(mode) {
        var count = 1;
        for(var y = 0; y < this.grid.length; y++){
            for(var x = 0; x < this.grid[y].length; x++){
                if(this.grid[y][x].number == 0){
                    var possible = this.getPossiblities(this.grid, this.grid[y][x]);
                    if(possible.length == 1){
                        this.grid[y][x].animInsert(possible[0], count);
                        count++;
                    }else{
                        this.shuffleArray(possible);
                        this.grid[y][x].possible = possible;
                        this.grid[y][x].walker = 0;
                        this.emptyNodes.push(this.grid[y][x]);
                    }
                }
            }
        }

        if(this.emptyNodes.length == 0){
            return false;
        }
        var solved = 0;
        var walker = 0;
        var valWalk;
        while(solved == 0){
            var currNode = this.emptyNodes[walker];
            for(valWalk = currNode.walker; valWalk < currNode.possible.length; valWalk++){
                if(this.checkPossible(currNode, currNode.possible[valWalk])){
                    count++;
                    walker++;
                    currNode.walker = valWalk + 1;
                    if(mode == 0){
                        this.grid[currNode.rowNum][currNode.colNum].setNum(currNode.possible[valWalk]);
                    }else{
                        this.grid[currNode.rowNum][currNode.colNum].insertNum(currNode.possible[valWalk]);
                    }
                    break;
                }
            }

            if(valWalk >= currNode.possible.length){
                walker--;
                currNode.walker = 0;
                currNode.number = 0;
                if(mode == 0){
                    this.grid[currNode.rowNum][currNode.colNum].setNum(0);
                }else{
                    this.grid[currNode.rowNum][currNode.colNum].insertNum(0);
                }
                
            }

            if(walker == this.emptyNodes.length){
                solved = 1;
            }

            if(walker == -1){
                return false;
            }
        }

        this.lastNode = this.emptyNodes[this.emptyNodes.length - 1];

        this.clearSelected();
        
        return true;
    }*/

}

class CheckPuzzle {

    checkQuestion(grid){
        var valid = true;
        this.grid = grid;
        for(var r of this.grid){
            for(var j of r){
                if(j.number != 0 && !this.checkPossible(j, j.number)){
                    j.invalid();
                    valid = false;
                }
            }
        }

        return valid;
    }

    checkPuzzle(grid){
        var valid = true;
        this.grid = grid;
        for(var r of this.grid){
            for(var j of r){
                if(!this.checkPossible(j, j.number)){
                    j.invalid();
                    valid = false;
                }
            }
        }

        return valid;
    }
    
    checkPossible(currNode, val) {
        var valid = true;
        if(val == 0){
            return false;
        }

        for (var i = 0; i < this.grid.length; i++) {
            if (this.grid[i][currNode.colNum].number == val && i != currNode.rowNum) {
                valid = false;
                this.grid[i][currNode.colNum].invalid();
            }
            if (this.grid[currNode.rowNum][i].number == val && i != currNode.colNum) {
                valid = false;
                this.grid[currNode.rowNum][i].invalid();
            }
        }

        var rowStart = Math.floor(currNode.rowNum / 3) * 3;
        var colStart = Math.floor(currNode.colNum / 3) * 3;

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (this.grid[rowStart + i][colStart + j].number == val && (rowStart + i) != currNode.rowNum && (colStart + j) != currNode.colNum) {
                    valid = false;
                    this.grid[rowStart + i][colStart + j].invalid();
                }
            }
        }

        return valid;
    }
}