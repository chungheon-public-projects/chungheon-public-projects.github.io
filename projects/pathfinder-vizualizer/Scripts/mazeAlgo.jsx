class subArea {
    /*Points 1, 2, 3, 4 represents the corners of an area
        1          2

        3          4
    */
    constructor(pt1, pt2, pt3, pt4) {
        this.pt1 = pt1;
        this.pt2 = pt2;
        this.pt3 = pt3;
        this.pt4 = pt4;
    }

    getWidth() {
        return this.pt2.colNum - this.pt1.colNum - 1;
    }

    getHeight() {
        return this.pt3.rowNum - this.pt1.rowNum - 1;
    }

    getRandomHorizontal() {
        var height = this.pt3.rowNum - this.pt1.rowNum - 1 - 3;
        var rowNum = Math.floor(Math.random() * height + 2) + this.pt1.rowNum;
        return rowNum;
    }

    getRandomVertical() {
        var width = this.pt2.colNum - this.pt1.colNum - 1 - 3;
        var colNum = Math.floor(Math.random() * width + 2) + this.pt1.colNum;
        return colNum;
    }
}

function surroundMaze() {
    var numWall = 0;
    var grid = this.pathFinder.grid;
    for (var i = 0; i < grid[0].length; i++) {
        setTimeout(buildWall, (numWall * 20), 0, i);
        grid[0][i].isWall = '1';
        grid[0][i].isWeight = '0';
        numWall++;
    }

    for (var i = 0; i < grid.length; i++) {
        setTimeout(buildWall, (numWall * 20), i, grid[0].length - 1);
        grid[i][grid[0].length - 1].isWall = '1';
        grid[i][grid[0].length - 1].isWeight = '0';
        numWall++;
    }
    for (var i = grid[0].length - 1; i >= 0; i--) {
        setTimeout(buildWall, (numWall * 20), grid.length - 1, i);
        grid[grid.length - 1][i].isWall = '1';
        grid[grid.length - 1][i].isWeight = '0';
        numWall++;
    }

    for (var i = grid.length - 1; i >= 0; i--) {
        setTimeout(buildWall, (numWall * 20), i, 0);
        grid[i][0].isWall = '1';
        grid[i][0].isWeight = '0';
        numWall++;
    }
    this.pathFinder.grid = grid;

    return numWall;
}

function buildWall(row, col) {
    var nodeID = 'node-' + row + '-' + col;
    var element = document.getElementById(nodeID);
    if(element.classList.contains('weight')){
        element.classList.remove('weight');
    }
    element.classList.add('wall');
}

class mazeGeneration {
    constructor() {
        this.grid;
        this.numWall;
    }

    generateMaze() {
        var areas = [];
        var width = this.grid[0].length - 1;
        var height = this.grid.length - 1;
        var pt1 = this.grid[0][0];
        var pt2 = this.grid[0][width];
        var pt3 = this.grid[height][0];
        var pt4 = this.grid[height][width];
        var newArea = new subArea(pt1, pt2, pt3, pt4, 1);
        areas.push(newArea);
        buildLoop: while (areas.length != 0) {
            var currArea = areas.shift();
            var orientation = this.ableToSplit(currArea);
            if (orientation == 1) {
                var wallRow = currArea.getRandomHorizontal();
                this.buildHorizontal(wallRow, currArea.getWidth(), currArea.pt1.colNum + 1);
                var newPt3 = new Node(wallRow, currArea.pt3.colNum, 0, 0);
                var newPt4 = new Node(wallRow, currArea.pt4.colNum, 0, 0);
                var newSub = new subArea(currArea.pt1, currArea.pt2, newPt3, newPt4);
                areas.push(newSub);
                var newPt1 = newPt3;
                var newPt2 = newPt4;
                var newSub2 = new subArea(newPt1, newPt2, currArea.pt3, currArea.pt4);
                areas.push(newSub2);
            } else if (orientation == 2) {
                var wallCol = currArea.getRandomVertical();
                this.buildVertical(wallCol, currArea.getHeight(), currArea.pt1.rowNum + 1);
                var newPt2 = new Node(currArea.pt2.rowNum, wallCol, 0, 0);
                var newPt4 = new Node(currArea.pt4.rowNum, wallCol, 0, 0);
                var newSub = new subArea(currArea.pt1, newPt2, currArea.pt3, newPt4);
                areas.push(newSub);
                var newPt1 = newPt2;
                var newPt3 = newPt4;
                var newSub2 = new subArea(newPt1, currArea.pt2, newPt3, currArea.pt4);
                areas.push(newSub2);
            }
        }
        setTimeout(function () { removeMazeTimer() }, (this.numWall - 1) * 20);
    }

    buildHorizontal(row, length, start) {
        var randomNum = Math.floor(Math.random() * (length)) + start;
        var currGrid = this.grid;
        var ended = 0;
        if (currGrid[row][start - 1].isWall == '0') {
            if (currGrid[row][start + length].isWall == '0') {
                ended = 1;
            } else {
                randomNum = start;
            }
        } else if (currGrid[row][start + length].isWall == '0') {
            randomNum = start + length - 1;
        }
        for (var i = start; i < length + start; i++) {
            if (i != randomNum) {
                if (ended == 1) {
                    if (i != start && i != length + start - 1) {
                        setTimeout(buildWall, (this.numWall * 20), row, i);
                        this.grid[row][i].isWall = '1';
                        this.grid[row][i].isWeight = '0';
                        this.numWall++;
                    }
                } else {
                    setTimeout(buildWall, (this.numWall * 20), row, i);
                    this.grid[row][i].isWall = '1';
                    this.grid[row][i].isWeight = '0';
                    this.numWall++;
                }
            }
        }

        return ended;
    }

    buildVertical(col, length, start) {
        var randomNum = Math.floor(Math.random() * (length)) + start;
        var currGrid = this.grid;
        var ended = 0;
        if (currGrid[start - 1][col].isWall == '0') {
            if (currGrid[start + length][col].isWall == '0') {
                ended = 1;
            } else {
                randomNum = start;
            }
        } else if (currGrid[start + length][col].isWall == '0') {
            randomNum = start + length - 1;
        }
        for (var i = start; i < length + start; i++) {
            if (i != randomNum) {
                if (ended == 1) {
                    if (i != start && i != length + start - 1) {
                        setTimeout(buildWall, (this.numWall * 20), i, col);
                        this.grid[i][col].isWall = '1';
                        this.grid[i][col].isWeight = '0';
                        this.numWall++;
                    }
                } else {
                    setTimeout(buildWall, (this.numWall * 20), i, col);
                    this.grid[i][col].isWall = '1';
                    this.grid[i][col].isWeight = '0';
                    this.numWall++;
                }

            }
        }

        return ended;
    }

    //check if able to split the area further
    //0 means unable to split
    //1 means split horizontally
    //2 means split vertically
    ableToSplit(currArea) {
        var height = currArea.getHeight();
        var width = currArea.getWidth();
        var totalSpace = height * width;
        if (totalSpace < 5 || height < 2 || width < 2) {
            return 0;
        } else if (height > width) {
            return 1;
        } else if (height < width) {
            return 2;
        } else {
            if (Math.round(Math.random()) == 0) {
                return 1;
            } else {
                return 2;
            }
        }
    }
}

class recursiveDivision {
    constructor() {
        this.grid;
        this.numWall;
    }

    generateMaze() {
        var areas = [];
        var width = this.grid[0].length - 1;
        var height = this.grid.length - 1;
        var pt1 = this.grid[0][0];
        var pt2 = this.grid[0][width];
        var pt3 = this.grid[height][0];
        var pt4 = this.grid[height][width];
        var newArea = new subArea(pt1, pt2, pt3, pt4, 1);
        areas.push(newArea);
        buildLoop: while (areas.length != 0) {
            var currArea = areas.shift();
            var orientation = this.ableToSplit(currArea);
            if (orientation == 1) {
                var wallRow = currArea.getRandomHorizontal();
                while (wallRow % 2 == 1) {
                    wallRow = currArea.getRandomHorizontal();
                }
                this.buildHorizontal(wallRow, currArea.getWidth(), currArea.pt1.colNum + 1);
                var newPt3 = this.grid[wallRow][currArea.pt3.colNum];
                var newPt4 = this.grid[wallRow][currArea.pt4.colNum];
                var newSub = new subArea(currArea.pt1, currArea.pt2, newPt3, newPt4);
                areas.push(newSub);
                var newPt1 = newPt3;
                var newPt2 = newPt4;
                var newSub2 = new subArea(newPt1, newPt2, currArea.pt3, currArea.pt4);
                areas.push(newSub2);
            } else if (orientation == 2) {
                var wallCol = currArea.getRandomVertical();
                while (wallCol % 2 == 1) {
                    wallCol = currArea.getRandomVertical();
                }
                this.buildVertical(wallCol, currArea.getHeight(), currArea.pt1.rowNum + 1);
                var newPt2 = this.grid[currArea.pt2.rowNum][wallCol];
                var newPt4 = this.grid[currArea.pt4.rowNum][wallCol];
                var newSub = new subArea(currArea.pt1, newPt2, currArea.pt3, newPt4);
                areas.push(newSub);
                var newPt1 = newPt2;
                var newPt3 = newPt4;
                var newSub2 = new subArea(newPt1, currArea.pt2, newPt3, currArea.pt4);
                areas.push(newSub2);
            }
        }
        setTimeout(function(){ removeMazeTimer() }, (this.numWall - 1) * 20);  
    }

    ableToSplit(currArea) {
        var height = currArea.getHeight();
        var width = currArea.getWidth();
        var totalSpace = height * width;
        if (totalSpace < 5 || height < 3 || width < 3) {
            return 0;
        } else if (height > width) {
            return 1;
        } else if (height < width) {
            return 2;
        } else {
            if (Math.round(Math.random()) == 0) {
                return 1;
            } else {
                return 2;
            }
        }
    }

    recursiveCheck(currArea) {
        var width = currArea.getWidth();
        var height = currArea.getHeight();
        if (height > 2 && width > 2) {
            return 1;
        }
        return 0;
    }

    buildHorizontal(row, length, start) {
        var randomNum = Math.floor(Math.random() * (length)) + start;
        while (randomNum % 2 == 0) {
            randomNum = Math.floor(Math.random() * (length)) + start;
        }
        for (var i = start; i < length + start; i++) {
            if (i != randomNum) {
                setTimeout(buildWall, (this.numWall * 20), row, i);
                this.grid[row][i].isWall = '1';
                this.grid[row][i].isWeight = '0';
                this.numWall++;
            }
        }
    }

    buildVertical(col, length, start) {
        var randomNum = Math.floor(Math.random() * (length)) + start;
        while (randomNum % 2 == 0) {
            randomNum = Math.floor(Math.random() * (length)) + start;
        }
        for (var i = start; i < length + start; i++) {
            if (i != randomNum) {
                setTimeout(buildWall, (this.numWall * 20), i, col);
                this.grid[i][col].isWall = '1';
                this.grid[i][col].isWeight = '0';
                this.numWall++;
            }
        }
    }
}