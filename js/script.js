
/****************************************************************************
    Connect the Dots | Galen Scovell, 05/21/15      

    Connecting points:
     1) Find point p (point with largest y-coordinate).
     2) Sort all other points by their polar angle with p.
     3) Connect points in order.
 
     Complexity: 
     Outside of sorting, time complexity is ~O(5n) since we iterate over 
     our n-sized Arrays five separate times. Space complexity is ~O(3n) as 
     we have three Arrays of size n (points, lines, drawnLines) in memory 
     at any one time.
 
     JavaScript's built-in array.sort() utilizes either mergesort or quicksort
     depending on browser. Time complexity either way is O(log(n)), space 
     complexity is either O(n) [mergesort] or O(log(n)) [quicksort].
****************************************************************************/



var context;
var points, lines, drawnLines;
var currentLine;
var linesCreated;
var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;


/*******************************
    LOGIC
*******************************/
function connectPoints() {
    var startingPoint = findStartingPoint();
    for (var i = 0; i < points.length; i++) {
        var angleFromStart = -Math.atan2(points[i].y - startingPoint.y, points[i].x - startingPoint.x);
        points[i].angle = angleFromStart;
    }
    points.sort(angleComparison);
    var previousPoint = startingPoint;
    for (var j = 1; j < points.length; j++) {
        createLine(points[j], previousPoint);
        previousPoint = points[j];
    }
    createLine(startingPoint, points[points.length - 1]);
    linesCreated = true;
}

function findStartingPoint() {
    var largestY = 0;
    var startingPoint;
    for (var i = 0; i < points.length; i++) {
        if (points[i].y > largestY) {
            startingPoint = points[i];
            largestY = startingPoint.y;
        }
    }
    startingPoint.state = 1;
    startingPoint.frame = 300;
    return startingPoint;
}

function createPoint(pointX, pointY) {
    points.push({x: pointX, y: pointY, angle: 0, frame: 300, state: 0});
}

function createLine(thisPoint, previousPoint) {
    var lineSlope = (thisPoint.y - previousPoint.y) / (thisPoint.x - previousPoint.x);
    var lineSections = Math.abs(thisPoint.x - previousPoint.x) / 30;
    if (thisPoint.x < previousPoint.x) {
        lineSlope = -lineSlope;
        lineSections = -lineSections;
    }
    lines.push({startX: previousPoint.x, startY: previousPoint.y,
                currentX: previousPoint.x, currentY: previousPoint.y,
                endX: thisPoint.x, endY: thisPoint.y,
                slope: lineSlope, sections: lineSections});
}


/*******************************
    RENDERING
*******************************/
function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (linesCreated) {
        renderLines();
        if (currentLine < lines.length) {
            animateLine(lines[currentLine]);
        }
    }
    renderPoints();
    requestAnimationFrame(render);
}

function renderLines() {
    context.strokeStyle = '#2980b9';
    context.lineWidth = 6;
    context.beginPath();
    for (var i = 0; i < drawnLines.length; i++) {
        context.moveTo(drawnLines[i].startX, drawnLines[i].startY)
        context.lineTo(drawnLines[i].endX, drawnLines[i].endY);
    }
    context.stroke();
}

function renderPoints() {
    for (var i = 0; i < points.length; i++) {
        if (points[i].state == 0) {
            context.fillStyle = '#34495e';
        } else if (points[i].state == 1) {
            context.fillStyle = '#3498db';
        }
        context.beginPath();
        context.arc(points[i].x, points[i].y, points[i].frame / 10, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        if (points[i].frame - 8 > 100) {
            points[i].frame -= 8;
        }
    }
}

function animateLine(line) {
    context.strokeStyle = '#8e44ad';
    context.lineWidth = 8;
    context.beginPath();
    context.moveTo(line.startX, line.startY);
    line.currentX += line.sections;
    line.currentY += line.slope * Math.abs(line.sections);
    context.lineTo(line.currentX, line.currentY);
    context.stroke();

    if ((line.startX <= line.endX && line.currentX >= line.endX) || (line.startX >= line.endX && line.currentX <= line.endX)) {
        drawnLines.push(line);
        currentLine++;
        if (currentLine < points.length) {
            points[currentLine].state = 1;
            points[currentLine].frame = 300;
        }
    }
}


/*******************************
    HELPER FUNCTIONS
*******************************/
function init() {
    $('#canvas').attr('height', window.innerHeight * 0.6);
    $('#canvas').attr('width', window.innerWidth * 0.8);
    context = $('#canvas')[0].getContext("2d");
    points = new Array();
    lines = new Array();
    drawnLines = new Array();
    currentLine = 0;
    linesCreated = false;
    $('#solve_button').text('Solve');
}

function angleComparison(v, w) {
    if (v.angle < w.angle) {
        return -1;
    } else if (v.angle > w.angle) {
        return 1;
    } else {
        return 0;
    }
}


/*******************************
    EVENTS
*******************************/
$('#solve_button').click(function(e) {
    if ($(this).text() == 'Solve') {
        connectPoints();
        $(this).text('Reset');
    } else if ($(this).text() == 'Reset') {
        init();
    }
})

$('#canvas').click(function(e) {
    if ($('#solve_button').text() == 'Reset') {
        return;
    }
    var offset = $(this).offset();
    var clickX = e.pageX - offset.left;
    var clickY = e.pageY - offset.top;
    createPoint(clickX, clickY);
})

$(window).resize(function() {
    init();
})

$(document).ready(function() {
    init();
    render();
})