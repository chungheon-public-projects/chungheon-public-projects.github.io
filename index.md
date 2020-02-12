<!DOCTYPE html>
<html>

<head>
    <title>PathFinder Visualizer</title>
    <link rel="stylesheet" href="Scripts/node.css">
    <link rel="stylesheet" href="Scripts/pathfinder.css">
    <script type="text/javascript" src="Scripts/node.jsx"></script>
    <script type="text/javascript" src="Scripts/pathfinder.jsx"></script>
    <script type="text/javascript" src="Scripts/algorithms.jsx"></script>
    <script type="text/javascript" src="Scripts/mazeAlgo.jsx"></script>

</head>

<body onload="loadTable()" ondragstart="allowDrag(event)">
    <div class="buttons">
        <ul>
            <h3>Pathfinder Visualizer</h3>
            <div class='algolist custom-select' style='width:200px'>
                <select>
                    <option value="0">Search Algorithm</option>
                    <option value="1">Breadth-First Search</option>
                    <option value="2">Djkstra Search</option>
                    <option value="3">Greedy Best-First Search</option>
                    <option value="4">A* Search</option>
                    <option value="5">Depth-First Search</option>
                </select>
            </div>
            <div class='mazelist custom-select' style='width:200px'>
                <select>
                    <option value="0">Maze Algorithm</option>
                    <option value="1">Recursive Division 1</option>
                    <option value="2">Recursive Division 2</option>
                </select>
            </div>
            <h4 id='visualbtn' onclick="runAlgo(1)">Visualize Algorithm</h4>
            <h4 onclick="generateMaze()">Generate Maze</h4>
            <h4 onclick="clearWalls()">Clear Weights & Walls</h4>
            <h4 id='weighttoggle' onclick="toggleWeight()">Toggle Weight :ON</h4>
        </ul>
    </div>
    <div class='legend'></div>
    <div id="grid">
    </div>
</body>

</html>