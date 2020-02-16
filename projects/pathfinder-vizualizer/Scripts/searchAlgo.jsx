//Shows the path with lowest weight from start node to end node
function showPathToEnd(endNode, numVisited, mode) {
    //Variable that will be used to contain the node along the path
    var walkerNode = endNode.previousNode;
    var count = 1;
    //Go back the linked nodes from end to the first node of the linked list which is the start node
    while (walkerNode.isStart != 1) {
        if (mode == 1) {
            addActiveTimer();
            setTimeout(showPath, (numVisited + count) * 10, walkerNode, mode);
        } else {
            showPath(walkerNode, mode);
        }
        //Set current node as previous node in linked list
        walkerNode = walkerNode.previousNode;
        count++;
    }
}

function swap(visitedNodes, indexA, indexB) {
    var temp = visitedNodes[indexA];
    visitedNodes[indexA] = visitedNodes[indexB];
    visitedNodes[indexB] = temp;
}

//Set the class of node for animation purposes
function showPath(pathNode, mode) {
    var nodeID = 'node-' + pathNode.rowNum + '-' + pathNode.colNum;
    var element = document.getElementById(nodeID);
    element.classList.add('shortestpath');
    element.classList.remove('visited');
    if(mode == 1){
        removeActiveTimer();
    }
}


function visitNode(currNode, mode) {
    var nodeID = 'node-' + currNode.rowNum + '-' + currNode.colNum;
    var element = document.getElementById(nodeID);
    if (mode == 1) {
        element.classList.add('visited');
        removeActiveTimer();
    } else {
        element.classList.add('noanimvisit');
    }
}

function runSearchAlgo(startNode, endNode, mode, algoType) {
    switch (algoType) {
        case 1: algo = new breadthFirst(this.pathFinder.grid); break;
        case 2: algo = new dijkstraAlgo(this.pathFinder.grid); break;
        case 3: algo = new greedyAlgo(this.pathFinder.grid); break;
        case 4: algo = new aStarAlgo(this.pathFinder.grid); break;
        case 5: algo = new depthFirstAlgo(this.pathFinder.grid); break;
    }
    if(typeof algo !== 'undefined'){
        if (mode == 1) {
            this.pathFinder.finishedAlgo = 1;
        }

        algo.runAlgo(startNode, endNode, mode);
        this.pathFinder.grid = algo.grid;

        if (mode == 1) {
            this.pathFinder.finishedAlgo = 2;
        }
    
        if (algo.found == 1) {
            showPathToEnd(algo.goal, algo.numVisited, mode)
        }
    }
    
}

class breadthFirst {
    constructor(grid) {
        this.grid = grid;
        this.found = 0;
        this.numVisited = 0;
        this.goal;
    }

    //Breath first algorithm
    runAlgo(startNode, endNode, mode) {
        //Empty array for adding neighbour nodes
        var neighbourNodes = [];
        //The starting node is the first visited node
        var visitedNodes = [startNode];
        var endNode;
        //found variable 0 denotes not found end and 1 denotes found end
        findingLoop: while (this.found == 0 && visitedNodes.length != 0) {
            //Visit every neighbour north,south,east,west of the previously visited nodes
            for (var i = 0; i < visitedNodes.length; i++) {
                var currRow = visitedNodes[i].rowNum;
                var currCol = visitedNodes[i].colNum;
                var startingNode = this.grid[currRow][currCol];
                for (var j = 0; j < 4; j++) {
                    //Switch cases to get the 4 neighbours
                    switch (j) {
                        case 0: currRow -= 1; break;
                        case 1: currRow += 1;
                            currCol -= 1; break;
                        case 2: currCol += 2; break;
                        case 3: currCol -= 1;
                            currRow += 1; break;
                    }
                    //Only check nodes within the range
                    if (currRow < this.grid.length && currCol < this.grid[0].length && currRow >= 0 && currCol >= 0) {
                        var currNode = this.grid[currRow][currCol];
                        //Check if node is the end node, if it is stop finding
                        if (currNode == endNode) {
                            this.found = 1;
                            currNode.previousNode = startingNode;
                            this.goal = currNode;
                            break findingLoop;
                        }
                        //Only visit nodes that have not been previously visited, not a wall, and not the start
                        else if (currNode.isStart != 1 && currNode.isWall != 1 && currNode.isVisited != 1) {
                            //Link this neighbour node to the current node
                            currNode.previousNode = startingNode;
                            //Visit the node, set isVisit to 1
                            currNode.visit();

                            //mode 2 doesnt show the animation of the search
                            //mode 1 shows the animation of search
                            if (mode == 1) {
                                addActiveTimer();
                                setTimeout(visitNode, (this.numVisited * 10), currNode, mode);
                            } else {
                                visitNode(currNode, mode);
                            }
                            //Increase number of visited nodes for animating purposes
                            this.numVisited++;
                            //Add this neighbour node to array of neighbour nodes
                            neighbourNodes.push(currNode);
                        }
                    }
                }
            }
            //Now to visit the neighbour of the array of neighbour nodes
            visitedNodes = neighbourNodes;
            //Clear the neighbour nodes
            neighbourNodes = [];
        }
    }
}

class dijkstraAlgo {
    constructor(grid) {
        this.grid = grid;
        this.numVisited = 0;
        this.found = 0;
        this.goal;
    }
    runAlgo(startNode, endNode, mode) {
        var visitedNodes = [startNode];
        findingLoop: while (this.found == 0 && visitedNodes.length != 0) {
            var startingNode = visitedNodes.shift();
            var currRow = startingNode.rowNum;
            var currCol = startingNode.colNum;
            for (var j = 0; j < 4; j++) {
                switch (j) {
                    case 0: currRow -= 1; break;
                    case 1: currRow += 1;
                        currCol -= 1; break;
                    case 2: currCol += 2; break;
                    case 3: currCol -= 1;
                        currRow += 1; break;
                }
                if (currRow < this.grid.length && currCol < this.grid[0].length && currRow >= 0 && currCol >= 0) {
                    var currNode = this.grid[currRow][currCol];
                    if (currNode == endNode) {
                        this.found = 1;
                        currNode.previousNode = startingNode;
                        this.goal = currNode;
                        break findingLoop;
                    } else if (currNode.isStart != 1 && currNode.isWall != 1 && currNode.isVisited != 1) {
                        currNode.previousNode = startingNode;
                        currNode.totalWeight += startingNode.totalWeight;
                        currNode.visit();
                        if (mode == 1) {
                            addActiveTimer();
                            setTimeout(visitNode, (this.numVisited * 10), currNode, mode);
                        } else {
                            visitNode(currNode, mode);
                        }
                        this.numVisited++;
                        visitedNodes.push(currNode);
                    }
                }
            }
            this.insertionSort(visitedNodes);
        }
    }

    insertionSort(visitedNodes) {
        for (var i = 1; i < visitedNodes.length; i++) {
            var currIndex = i;
            var prevIndex = i - 1;
            while (prevIndex >= 0 && visitedNodes[prevIndex].totalWeight > visitedNodes[currIndex].totalWeight) {
                swap(visitedNodes, currIndex, prevIndex);
                currIndex--;
                prevIndex--;
            }
        }
    }
}

class greedyAlgo {
    constructor(grid) {
        this.grid = grid;
        this.numVisited = 0;
        this.found = 0;
        this.goal;
    }

    runAlgo(startNode, endNode, mode) {
        var visitedNodes = [startNode];
        var endNode;
        findingLoop: while (this.found == 0 && visitedNodes.length != 0) {
            var startingNode = visitedNodes.shift();
            var currRow = startingNode.rowNum;
            var currCol = startingNode.colNum;
            for (var j = 0; j < 4; j++) {
                switch (j) {
                    case 0: currRow -= 1; break;
                    case 1: currRow += 1;
                        currCol -= 1; break;
                    case 2: currCol += 2; break;
                    case 3: currCol -= 1;
                        currRow += 1; break;
                }
                if (currRow < this.grid.length && currCol < this.grid[0].length && currRow >= 0 && currCol >= 0) {
                    var currNode = this.grid[currRow][currCol];
                    if (currNode == endNode) {
                        this.found = 1;
                        currNode.previousNode = startingNode;
                        this.goal = currNode;
                        break findingLoop;
                    } else if (currNode.isStart != 1 && currNode.isWall != 1 && currNode.isVisited != 1) {
                        currNode.previousNode = startingNode;
                        currNode.visit();
                        if (mode == 1) {
                            addActiveTimer();
                            setTimeout(visitNode, (this.numVisited * 10), currNode, mode);
                        } else {
                            visitNode(currNode, mode);
                        }
                        this.numVisited++;
                        visitedNodes.push(currNode);
                    }
                }
            }
            this.insertionSort(visitedNodes, endNode);
        }
    }

    insertionSort(visitedNodes, endNode) {
        for (var i = 1; i < visitedNodes.length; i++) {
            var currIndex = i;
            var prevIndex = i - 1;
            var currDiff = endNode.getEstimate(visitedNodes[currIndex].rowNum, visitedNodes[currIndex].colNum);
            var prevDiff = endNode.getEstimate(visitedNodes[prevIndex].rowNum, visitedNodes[prevIndex].colNum);
            while (prevIndex >= 0 && prevDiff > currDiff) {
                swap(visitedNodes, currIndex, prevIndex);
                currIndex--;
                prevIndex--;
                if (prevIndex >= 0) {
                    currDiff = endNode.getEstimate(visitedNodes[currIndex].rowNum, visitedNodes[currIndex].colNum);
                    prevDiff = endNode.getEstimate(visitedNodes[prevIndex].rowNum, visitedNodes[prevIndex].colNum);
                }
            }
        }
    }
}

class aStarAlgo {
    constructor(grid) {
        this.grid = grid;
        this.numVisited = 0;
        this.found = 0;
        this.goal;
    }

    runAlgo(startNode, endNode, mode) {
        var visitedNodes = [startNode];
        findingLoop: while (this.found == 0 && visitedNodes.length != 0) {
            var startingNode = visitedNodes.shift();
            var currRow = startingNode.rowNum;
            var currCol = startingNode.colNum;
            for (var j = 0; j < 4; j++) {
                switch (j) {
                    case 0: currRow -= 1; break;
                    case 1: currRow += 1;
                        currCol -= 1; break;
                    case 2: currCol += 2; break;
                    case 3: currCol -= 1;
                        currRow += 1; break;
                }
                if (currRow < this.grid.length && currCol < this.grid[0].length && currRow >= 0 && currCol >= 0) {
                    var currNode = this.grid[currRow][currCol];
                    if (currNode == endNode) {
                        this.found = 1;
                        currNode.previousNode = startingNode;
                        this.goal = currNode;
                        break findingLoop;
                    } else if (currNode.isStart != 1 && currNode.isWall != 1 && currNode.isVisited != 1) {
                        currNode.previousNode = startingNode;
                        currNode.totalWeight += startingNode.totalWeight;
                        currNode.visit();
                        if (mode == 1) {
                            addActiveTimer();
                            setTimeout(visitNode, (this.numVisited * 10), currNode, mode);
                        } else {
                            visitNode(currNode, mode);
                        }
                        this.numVisited++;
                        visitedNodes.push(currNode);
                    }
                }
            }
            this.insertionSort(visitedNodes, endNode);
        }
    }

    insertionSort(visitedNodes, endNode) {
        for (var i = 1; i < visitedNodes.length; i++) {
            var currIndex = i;
            var prevIndex = i - 1;
            var currDiff = endNode.getEstimate(visitedNodes[currIndex].rowNum, visitedNodes[currIndex].colNum) + visitedNodes[currIndex].totalWeight;
            var prevDiff = endNode.getEstimate(visitedNodes[prevIndex].rowNum, visitedNodes[prevIndex].colNum) + visitedNodes[prevIndex].totalWeight;
            while (prevIndex >= 0 && prevDiff > currDiff) {
                swap(visitedNodes, currIndex, prevIndex);
                currIndex--;
                prevIndex--;
                if (prevIndex >= 0) {
                    currDiff = endNode.getEstimate(visitedNodes[currIndex].rowNum, visitedNodes[currIndex].colNum) + visitedNodes[currIndex].totalWeight;
                    prevDiff = endNode.getEstimate(visitedNodes[prevIndex].rowNum, visitedNodes[prevIndex].colNum) + visitedNodes[prevIndex].totalWeight;
                }
            }
        }
    }
}

class depthFirstAlgo {
    constructor(grid) {
        this.grid = grid;
        this.numVisited = 0;
        this.found = 0;
        this.goal;
    }

    runAlgo(startNode, endNode, mode) {
        //Empty array for adding neighbour nodes
        var prevVisitedNodes = [];
        //The starting node is the first visited node
        var visitedNodes = [startNode];
        //found variable 0 denotes not found end and 1 denotes found end
        findingLoop: while (this.found == 0 && visitedNodes.length != 0) {
            //Visit every neighbour north,south,east,west of the previously visited nodes
            for (var i = 0; i < visitedNodes.length; i++) {
                var currRow = visitedNodes[i].rowNum;
                var currCol = visitedNodes[i].colNum;
                var startingNode = this.grid[currRow][currCol];
                for (var j = 0; j < 4; j++) {
                    //Switch cases to get the 4 neighbours
                    switch (j) {
                        case 0: currRow -= 1; 
                                this.searchUp(currRow, currCol, startingNode, prevVisitedNodes,mode);
                        break;
                        case 1: currRow += 1;
                            currCol -= 1; 
                            this.searchLeft(currRow, currCol, startingNode, prevVisitedNodes, mode); break;
                        case 2: currCol += 2;
                            this.searchRight(currRow, currCol, startingNode, prevVisitedNodes, mode); break;
                        case 3: currCol -= 1;
                            currRow += 1; 
                            this.searchDown(currRow, currCol, startingNode, prevVisitedNodes, mode); break;
                    }
                    if(this.found == 1){
                        break findingLoop;
                    }
                }
            } 
            //Now to visit the neighbour of the array of neighbour nodes
            visitedNodes = prevVisitedNodes;
            //Clear the neighbour nodes
            prevVisitedNodes = [];
        }
    }

    searchUp(currRow, currCol, startingNode, prevVisitedNodes, mode){
        var prevNode = startingNode;
        for (var k = currRow; k >= 0; k--) {
            var currNode = this.grid[k][currCol];
            if (currNode.isEnd == 1) {
                this.found = 1;
                currNode.previousNode = prevNode;
                this.goal = currNode;
                break;
            }else if(currNode.isWall == 1){
                break;  
            }else if (currNode.isStart != 1 && currNode.isWall != 1 && currNode.isVisited != 1) {
                this.visitNode(currNode, prevNode, prevVisitedNodes, mode);
            }
            prevNode = currNode;
        }
    }

    searchLeft(currRow, currCol, startingNode, prevVisitedNodes, mode){
        var prevNode = startingNode;
        for (var k = currCol; k >= 0; k--) {
            var currNode = this.grid[currRow][k];
            if (currNode.isEnd == 1) {
                this.found = 1;
                currNode.previousNode = prevNode;
                this.goal = currNode;
                break;
            }else if(currNode.isWall == 1 || currNode.isVisited == 1){
                break;  
            } else if (currNode.isStart != 1 && currNode.isWall != 1 && currNode.isVisited != 1) {
                this.visitNode(currNode, prevNode, prevVisitedNodes, mode);
            }
            prevNode = currNode;
        }
    }

    searchDown(currRow, currCol, startingNode, prevVisitedNodes, mode){
        var prevNode = startingNode;
        for (var k = currRow; k < this.grid.length; k++) {
            var currNode = this.grid[k][currCol];
            if (currNode.isEnd == 1) {
                this.found = 1;
                currNode.previousNode = prevNode;
                this.goal = currNode;
                break;
            }else if(currNode.isWall == 1 || currNode.isVisited == 1){
                break;  
            } else if (currNode.isStart != 1 && currNode.isWall != 1 && currNode.isVisited != 1) {
                this.visitNode(currNode, prevNode, prevVisitedNodes, mode);
            }
            prevNode = currNode;
        }
    }

    searchRight(currRow, currCol, startingNode, prevVisitedNodes, mode){
        var prevNode = startingNode;
        for (var k = currCol; k < this.grid[0].length; k++) {
            var currNode = this.grid[currRow][k];
            if (currNode.isEnd == 1) {
                this.found = 1;
                currNode.previousNode = prevNode;
                this.goal = currNode;
                break;
            }else if(currNode.isWall == 1){
                break;  
            } else if (currNode.isStart != 1 && currNode.isWall != 1 && currNode.isVisited != 1) {
                this.visitNode(currNode, prevNode, prevVisitedNodes, mode);
            }
            prevNode = currNode;
        }
    }

    visitNode(currNode, prevNode, prevVisitedNodes, mode){
        //Link this neighbour node to the current node
        currNode.previousNode = prevNode;
        //Visit the node, set isVisit to 1
        currNode.visit();
        //mode 2 doesnt show the animation of the search
        //mode 1 shows the animation of search
        if (mode == 1) {
            addActiveTimer();
            setTimeout(visitNode, (this.numVisited * 10), currNode, mode);
        } else {
            visitNode(currNode, mode);
        }
        //Increase number of visited nodes for animating purposes
        this.numVisited++;
        //Add this neighbour node to array of neighbour nodes
        prevVisitedNodes.push(currNode);
    }

}

/*

function testInsertionSort() {
    //Test insertion sort
    var pt1 = new Node(0, 0, 0, 0);
    pt1.weight = 5;
    var pt2 = new Node(0, 0, 0, 0);
    pt2.weight = 1;
    var pt3 = new Node(0, 0, 0, 0);
    pt3.weight = 4;
    var pt4 = new Node(0, 0, 0, 0);
    pt4.weight = 3;
    var pt5 = new Node(0, 0, 0, 0);
    pt5.weight = 2;
    var test = [];
    test.push(pt1);
    test.push(pt2);
    test.push(pt3);
    test.push(pt4);
    test.push(pt5);
    insertionSort(test);
    for (var i = 0; i < 5; i++) {
        console.log(test[i].weight);
    }

    function testSwap() {
        //Test Swap
        var testArr = [];
        testArr.push(1);
        testArr.push(2);
        console.log(testArr[0] + ' ' + testArr[1]);
        swap(testArr, 0, 1);
        console.log(testArr[0] + ' ' + testArr[1]);
    }

    function step() {
        //Step by step for djkstra algorithm
        if (this.stepCount == 0) {
            this.startingNode = this.visitedNodes.shift()
        }
        var currRow = startingNode.rowNum;
        var currCol = startingNode.colNum;
        var mode = 1;
        switch (this.stepCount) {
            case 0: currRow -= 1; break;
            case 1: currCol -= 1; break;
            case 2: currCol += 1; break;
            case 3: currRow += 1; break;
        }
        if (currRow < this.grid.length && currCol < this.grid[0].length && currRow >= 0 && currCol >= 0) {
            var currNode = this.grid[currRow][currCol];
            if (currNode.isEnd == '1') {

            } else if (currNode.isStart != '1' && currNode.isWall != '1' && currNode.isVisited != '1') {
                currNode.previousNode = this.startingNode;
                currNode.totalWeight += this.startingNode.totalWeight;
                currNode.visit();
                visitNode(currNode, mode);
                this.visitedNodes.push(currNode);
                insertionSort(this.visitedNodes);
                this.stepCount++;
                this.stepCount = this.stepCount % 4;
            } else {
                this.stepCount++;
                this.stepCount = this.stepCount % 4;
                step();
            }
        }
    }
*/