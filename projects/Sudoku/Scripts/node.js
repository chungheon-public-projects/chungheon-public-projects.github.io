class Node{
    constructor(rowNum, colNum){
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.number = 0;
        //0 means it was part of the base, 1 means manually added
        this.base = 0;
        this.walker = 0;
        this.possible;
    }

    render(){
        var node = "<td class=\"";
        node += "\" id=\"node-" + this.rowNum + "-" + this.colNum
        node += "\" ondragstart=\"allowDrag(event)\">" + "</td>";
        return node;
    }

    insertNum(val){
        var element = document.getElementById("node-" + this.rowNum + "-" + this.colNum);
        if(val == 0){
            element.innerText = "";
            this.number = val;
            this.base = 0;
            element.classList.remove("qns");
            return;
        }
        this.base = 1;
        this.number = val;
        element.innerText = val;
        element.classList.add("qns");
    }

    setNum(val){
        var element = document.getElementById("node-" + this.rowNum + "-" + this.colNum);
        if(val == 0){
            element.innerText = "";
            this.number = val;
            this.base = 0;
            return;
        }
        this.number = val;
        element.innerText = val;
    }

    animInsert(val, count){
        this.number = val;
        setTimeout(this.addNum, count * 10, val, this.rowNum, this.colNum);
    }

    addNum(val, rowNum, colNum){
        var element = document.getElementById("node-" + rowNum + "-" + colNum);
        var curr = document.getElementsByClassName("currentNode");
        for(var e of curr){
            e.classList.remove("currentNode");
        }
        element.classList.add("currentNode");
        if(val == 0){
            this.base = 0;
            element.innerText = "";
            this.number = val;
            return;
        }
        element.innerText = val;
    }

    selected(){
        var element = document.getElementById("node-" + this.rowNum + "-" + this.colNum);
        element.classList.add("selected");
    }

    unselect(){
        var element = document.getElementById("node-" + this.rowNum + "-" + this.colNum);
        element.classList.remove("selected");
    }

    bindClick(sudoku){
        var element = document.getElementById("node-" + this.rowNum + "-" + this.colNum);
        element.onmouseup = sudoku.bindEvent(element, this.rowNum, this.colNum);
    }

    invalid(){
        var element = document.getElementById("node-" + this.rowNum + "-" + this.colNum);
        element.classList.add("invalid");
    }

    clearStatus(){
        var element = document.getElementById("node-" + this.rowNum + "-" + this.colNum);
        if(element.classList.contains("qns")){
            element.classList = "";
            element.classList.add("qns");
        }else{
            element.classList = "";
        }
        
    }
}