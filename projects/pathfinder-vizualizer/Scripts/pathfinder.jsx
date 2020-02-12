class Pathfinder {
    constructor() {
        this.startNode = "12 15";
        this.endNode = "12 45";
        this.grid = this.getGrid();
        this.selectedEnd = 0;
        this.selectedStart = 0;
        this.mouseDown = 0;
        this.finishedAlgo = 0;
        this.weightSelection = 1;
        this.algoChoice = 0;
        this.mazeChoice = 0;
        this.activeTimers = 0;
        this.mazeTimer = 0;
    }

    getNode(row, col) {
        var node = row + " " + col;
        if (node == this.startNode) {
            return new Node(row, col, 1, 0);
        } else if (node == this.endNode) {
            return new Node(row, col, 0, 1);
        } else {
            return new Node(row, col, 0, 0);
        }
    }

    getGrid() {
        const grid = [];
        for (let row = 0; row < 25; row++) {
            const currentRow = [];
            for (let col = 0; col < 60; col++) {
                var node = this.getNode(row, col);
                currentRow.push(node);
            }
            grid.push(currentRow);
        }
        return grid;
    }

    getTable() {
        var myTable = "<table id=\"displayTable\" align=\"center\" cellspacing=\"0\" ondragover=\"allowDrop(event)\">"

        for (var i = 0; i < this.grid.length; i++) {
            myTable += "<tr>"
            for (var j = 0; j < this.grid[i].length; j++) {
                myTable += this.grid[i][j].render();
            }
            myTable += "</tr>"
        }
        myTable += "</table>"

        return myTable;
    }

    clearWalls() {
        var els = document.querySelectorAll('.wall');

        for (var i = 0; i < els.length; i++) {
            els[i].classList.remove('wall');
        }

        var els = document.querySelectorAll('.weight');

        for (var i = 0; i < els.length; i++) {
            els[i].classList.remove('weight');
        }

        var els = document.querySelectorAll('.visited');

        for (var i = 0; i < els.length; i++) {
            els[i].classList.remove('visited');
        }

        var els = document.querySelectorAll('.noanimvisit');

        for (var i = 0; i < els.length; i++) {
            els[i].classList.remove('noanimvisit');
        }

        els = document.querySelectorAll('.shortestpath');

        for (var i = 0; i < els.length; i++) {
            els[i].classList.remove('shortestpath');
        }
        this.grid = this.getGrid();
    }

    clearGrid() {
        var els = document.querySelectorAll('.visited');

        for (var i = 0; i < els.length; i++) {
            els[i].classList.remove('visited');
        }

        var els = document.querySelectorAll('.noanimvisit');

        for (var i = 0; i < els.length; i++) {
            els[i].classList.remove('noanimvisit');
        }

        els = document.querySelectorAll('.shortestpath');

        for (var i = 0; i < els.length; i++) {
            els[i].classList.remove('shortestpath');
        }

        for (var i = 0; i < this.grid.length; i++) {
            for (var j = 0; j < this.grid[i].length; j++) {
                this.grid[i][j].isVisited = '0';
                if (this.grid[i][j].isWeight == 1) {
                    this.grid[i][j].totalWeight = 10;
                } else {
                    this.grid[i][j].totalWeight = 1;
                }
            }
        }
    }

    removeClasses() {
        for (var i = 0; i < els.length; i++) {
            els[i].classList.remove('active')
        }
    }

    renderTable() {
        var tableSection = this.getTable();
        document.getElementById("grid").innerHTML = tableSection;
        this.clickCell();
    }

    clickCell() {
        var pf = this;
        document.onmouseup = function () {
            pf.mouseDown = 0;
            pf.selectedEnd = 0;
            pf.selectedStart = 0;
        };
        var table = document.getElementById("displayTable");

        for (var i = 0; i < table.rows.length; i++) {
            for (var j = 0; j < table.rows[i].cells.length; j++) {
                table.rows[i].cells[j].onmousedown = this.nodePress(i, j);
                this.bindEvent(table.rows[i].cells[j], i, j);
            }
        }
    }

    bindEvent(tableCell, i, j) {
        var pf = this;
        tableCell.addEventListener('mouseenter', e => {
            pf.nodeEnter(i, j);
        });
    }

    nodePress(i, j) {
        var pf = this;
        return function () {
            pf.mouseDown = 1;
            var nodeNum = i + ' ' + j;
            if (nodeNum != pf.startNode && nodeNum != pf.endNode && getActiveTimers() <= 0) {
                var element = document.getElementById('node-' + i + '-' + j);
                if (pf.weightSelection == 1) {
                    if (element.classList.contains('weight')) {
                        element.classList.remove('weight');
                        pf.grid[i][j].isWeight = 0;
                        element.classList.remove('weight');
                    } else {
                        element.classList = '';
                        element.classList.add('weight');

                        pf.grid[i][j].isWall = 0;
                        pf.grid[i][j].isWeight = 1;
                    }
                } else {
                    if (element.classList.contains('wall')) {
                        element.classList.remove('wall');
                        pf.grid[i][j].isWall = 0;
                    } else {
                        element.classList = '';
                        element.classList.add('wall');
                        pf.grid[i][j].isWeight = 0;
                        pf.grid[i][j].isWall = 1;
                    }
                }
            } else if((nodeNum == pf.startNode || nodeNum == pf.endNode) && getActiveTimers() <= 0) {
                if (nodeNum == pf.endNode) {
                    pf.selectedEnd = 1;
                } else if (nodeNum == pf.startNode) {
                    pf.selectedStart = 1;
                }
            }
        }
    }

    nodeEnter(i, j) {
        var nodeNum = i + ' ' + j;
        if (this.selectedEnd == 1 && nodeNum != this.startNode && this.activeTimers <= 0) {
            var points = this.endNode.split(" ");
            var prev = document.getElementById('node-' + points[0] + '-' + points[1]);
            prev.classList.remove('node-end');
            this.grid[points[0]][points[1]].isEnd = 0;
            this.endNode = nodeNum;
            var curr = document.getElementById('node-' + i + '-' + j);
            curr.classList.add('node-end');
            this.grid[i][j].isEnd = 1;
            if (this.finishedAlgo == 2) {
                runAlgo(2);
            }
        } else if (this.selectedStart == 1 && nodeNum != this.endNode && this.activeTimers <= 0) {
            var points = this.startNode.split(" ");
            var prev = document.getElementById('node-' + points[0] + '-' + points[1]);
            prev.classList.remove('node-start');
            this.grid[points[0]][points[1]].isStart = 0;
            this.startNode = nodeNum;
            var curr = document.getElementById('node-' + i + '-' + j);
            curr.classList.add('node-start');
            this.grid[i][j].isStart = 1;
            if (this.finishedAlgo == 2) {
                runAlgo(2);
            }
        } else if (nodeNum != this.startNode && nodeNum != this.endNode && this.mouseDown == 1 && this.activeTimers <= 0) {
            var element = document.getElementById('node-' + i + '-' + j);
            if (this.weightSelection == 1) {
                if (element.classList.contains('weight')) {
                    element.classList.remove('weight');
                    this.grid[i][j].isWeight = 0;
                } else {
                    element.classList = '';
                    element.classList.add('weight');
                    this.grid[i][j].isWall = 0;
                    this.grid[i][j].isWeight = 1;
                }
            } else {
                if (element.classList.contains('wall')) {
                    element.classList.remove('wall');
                    this.grid[i][j].isWall = 0;
                } else {
                    element.classList = '';
                    element.classList.add('wall');
                    this.grid[i][j].isWeight = 0;
                    this.grid[i][j].isWall = 1;
                }
            }
        }
    }
}

function allowDrag(ev) {
    ev.preventDefault();
}

function loadTable() {
    this.pathFinder = new Pathfinder();
    this.pathFinder.renderTable();
    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 87) {
            toggleWeight();
        }
    });

    customAlgoList();
    customMazeList();
    /* If the user clicks anywhere outside the select box,
    then close all select boxes: */
    document.addEventListener("click", closeAllSelect);
}

function customAlgoList() {
    var x, i, j, selElmnt, a, b, c;
    /* Look for any elements with the class "custom-select": */
    x = document.getElementsByClassName("algolist");
    selElmnt = x[0].getElementsByTagName("select")[0];
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[0].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < selElmnt.length; j++) {
        /* For each option in the original select element,
        create a new DIV that will act as an option item: */
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
            /* When an item is clicked, update the original select box,
            and the selected item: */
            var y, i, k, s, h;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            h = this.parentNode.previousSibling;
            for (i = 0; i < s.length; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    for (k = 0; k < y.length; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
        setAlgoListener(c, j);
    }
    x[0].appendChild(b);
    a.addEventListener("click", function (e) {
        /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}

function setAlgoListener(element, choice) {
    var pf = this.pathFinder;
    element.addEventListener("click", function (e) {
        pf.algoChoice = choice;
    });
}

function customMazeList() {
    var x, i, j, selElmnt, a, b, c;
    /* Look for any elements with the class "custom-select": */
    x = document.getElementsByClassName("mazelist");
    selElmnt = x[0].getElementsByTagName("select")[0];
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[0].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < selElmnt.length; j++) {
        /* For each option in the original select element,
        create a new DIV that will act as an option item: */
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
            /* When an item is clicked, update the original select box,
            and the selected item: */
            var y, i, k, s, h;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            h = this.parentNode.previousSibling;
            for (i = 0; i < s.length; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    for (k = 0; k < y.length; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
        setMazeListener(c, j);
    }
    x[0].appendChild(b);
    a.addEventListener("click", function (e) {
        /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}

function setMazeListener(element, choice) {
    var pf = this.pathFinder;
    element.addEventListener("click", function (e) {
        pf.mazeChoice = choice;
    });
}

function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x, y, i, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    for (i = 0; i < y.length; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < x.length; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}


function runAlgo(mode) {
    if(getActiveTimers() > 0){
        return;
    }
    this.pathFinder.clearGrid();
    var startNode = this.pathFinder.startNode.split(" ");
    var startRow = parseInt(startNode[0]);
    var startCol = parseInt(startNode[1]);
    startNode = this.pathFinder.grid[startRow][startCol];
    var endNode = this.pathFinder.endNode.split(" ");
    rowNum = parseInt(endNode[0]);
    colNum = parseInt(endNode[1]);
    endNode = this.pathFinder.grid[rowNum][colNum];
    runSearchAlgo(startNode, endNode, mode, this.pathFinder.algoChoice);
}

function generateMaze(){
    if(getActiveTimers() > 0 || this.pathFinder.mazeTimer == 1){
        return;
    }
    var mazeGenerator;
    var mazeType = this.pathFinder.mazeChoice;
    switch(mazeType){
        case 1: mazeGenerator = new mazeGeneration(); break;
        case 2: mazeGenerator = new recursiveDivision(); break;
    }

    if(typeof mazeGenerator !== 'undefined'){
        clearWalls();
        this.pathFinder.mazeTimer = 1;
        mazeGenerator.numWall = surroundMaze();
        mazeGenerator.grid = this.pathFinder.grid;
        mazeGenerator.generateMaze();
        this.pathFinder.grid = mazeGenerator.grid;
    }
}

function clearWalls() {
    if(getActiveTimers() > 0 || this.pathFinder.mazeTimer == 1){
        return;
    }
    this.pathFinder.finishedAlgo = 0;
    this.pathFinder.clearWalls();
}

function toggleWeight() {
    var element = document.getElementById('weighttoggle');
    if (this.pathFinder.weightSelection == 0) {
        this.pathFinder.weightSelection = 1;
        element.innerText = 'Toggle Weight: ON';
    } else {
        this.pathFinder.weightSelection = 0;
        element.innerText = 'Toggle Weight: OFF';
    }
}

function addActiveTimer(){
    if(this.pathFinder.activeTimers == 0){
        var element = document.getElementById('visualbtn');
        element.style.color = 'red';
    }
    this.pathFinder.activeTimers++;
}

function removeActiveTimer(){
    this.pathFinder.activeTimers--;
    if(this.pathFinder.activeTimers == 0){
        var element = document.getElementById('visualbtn');
        element.style = '';
    }
}

function getActiveTimers(){
    return this.pathFinder.activeTimers;
}

function removeMazeTimer(){
    this.pathFinder.mazeTimer = 0;
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }