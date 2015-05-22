
/*************************************************
    Connect the Dots | Galen Scovell, 05/21/15      
**************************************************/


var context;
var points, lines, drawnLines;
var currentLine, linesCreated;
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
    for (var i = 1; i < points.length; i++) {
        createLine(points[i], previousPoint);
        previousPoint = points[i];
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
    lines.push({startX: previousPoint.x,
                startY: previousPoint.y,
                currentX: previousPoint.x, 
                currentY: previousPoint.y,
                endX: thisPoint.x,
                endY: thisPoint.y,
                slope: lineSlope,
                sections: lineSections});
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
    if (line.currentX < line.endX) {
        line.currentX += line.sections;
        line.currentY += line.slope * line.sections;
    } else {
        line.currentX -= line.sections;
        line.currentY -= line.slope * line.sections;
    }
    context.lineTo(line.currentX, line.currentY);
    context.stroke();

    if ((line.startX < line.endX && line.currentX >= line.endX) || (line.startX > line.endX && line.currentX <= line.endX)) {
        currentLine++;
        if (currentLine < points.length) {
            points[currentLine].state = 1;
            points[currentLine].frame = 300;
        }
        drawnLines.push(line);
    }
}


/*******************************
    HELPER FUNCTIONS
*******************************/
function initCanvas() {
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
        initCanvas();
    }
})

$('#canvas').click(function(e) {
    var offset = $(this).offset();
    var clickX = e.pageX - offset.left;
    var clickY = e.pageY - offset.top;
    createPoint(clickX, clickY);
})

$(window).resize(function() {
    initCanvas();
})

$(document).ready(function() {
    initCanvas();
    render();
})