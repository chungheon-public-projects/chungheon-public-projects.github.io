class Node{
    constructor(rowNum, colNum, isStart, isEnd){
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.isStart = isStart;
        this.isEnd = isEnd;
        this.isVisited = 0;
        this.isWeight = 0;
        this.totalWeight = 1;
        this.prevNode;
        this.isWall = 0;
    }

    setPrev(prevNode){
        this.prevNode = prevNode;
    }

    visit(){
        this.isVisited = 1;
    }

    render(){
        var node = "<td class=\"";
        if(this.isStart == 1){
            node += "node-start";
        }else if(this.isEnd == 1){
            node += "node-end";
        }else if(this.isWall == 1){
            node += "wall";
        }else if(this.isVisited == 1){
            node += "noanimvisit";
        }
        
        node += "\" id=\"node-" + this.rowNum + "-"+ this.colNum + "\" ondragstart=\"allowDrag(event)\">Node "+ this.rowNum + " " + this.colNum + "</td>";

        return node;
    }

    getEstimate(beginRow, beginCol){
        var est = 0;
        if(this.rowNum >= beginRow){
            est += this.rowNum - beginRow;
        }else{
            est += beginRow - this.rowNum;
        }

        if(this.colNum >= beginCol){
            est += this.colNum - beginCol;
        }else{
            est += beginCol - this.colNum;
        }

        return est;
    }
}