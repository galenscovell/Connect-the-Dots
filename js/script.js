
/******************************************************************************
    Connect the Dots | Galen Scovell, 05/21/15

    Connecting points:
    1) Find point n -> point with largest y-coordinate.
    2) Sort all other points by their polar angle with n.
    3) Connect points in order.

    Complexity: 
    Outside of sorting, time complexity is [O(3n)] since we iterate over one
    points Array three separate times. Space complexity is O(n) as we only 
    ever have one Array of points in memory.

    JavaScript built-in array.sort() utilizes either mergesort or quicksort
    depending on browser. Time complexity either way is [O(log(n))], space 
    either [O(n)] (mergesort) or [O(log(n))] (quicksort).
******************************************************************************/


context = $('#canvas')[0].getContext("2d");
points = new Array();
requestAnimationFrame = window.requestAnimationFrame || 
                        window.mozRequestAnimationFrame || 
                        window.webkitRequestAnimationFrame || 
                        window.msRequestAnimationFrame;


/*******************************
    POINT FUNCTIONALITY
*******************************/
function drawLines(startingPoint) {
    var previousPoint = startingPoint;
    for (var i = 1; i < points.length; i++) {
        context.beginPath();
        context.moveTo(previousPoint.x, previousPoint.y);
        context.lineTo(points[i].x, points[i].y);
        context.stroke();
        previousPoint = points[i];
    }
    context.beginPath();
    context.moveTo(previousPoint.x, previousPoint.y);
    context.lineTo(startingPoint.x, startingPoint.y);
    context.stroke();
}

function connectPoints() {
    var startingPoint = findStartingPoint();
    for (var i = 0; i < points.length; i++) {
        var angleFromStart = -Math.atan2(points[i].y - startingPoint.y, points[i].x - startingPoint.x);
        points[i].angle = angleFromStart;
    }
    points.sort(angleComparison);
    printPoints();
    // drawLines(startingPoint);
}

function findStartingPoint() {
    // Find point with largest y, set as starting point and remove from points array
    var largestY = 0;
    var startingPoint;
    for (var i = 0; i < points.length; i++) {
        if (points[i].y > largestY) {
            startingPoint = points[i];
            largestY = startingPoint.y;
        }
    }
    // points.splice(points.indexOf(startingPoint), 1);
    startingPoint.state = 1;
    startingPoint.frame = 200;
    return startingPoint;
}

function drawPoint(pointX, pointY) {
    points.push({x:pointX, y:pointY, angle:0, frame:200, state:0});
}


/*******************************
    RENDER FUNCTIONS
*******************************/
function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < points.length; i++) {
        if (points[i].state == 0) {
            context.shadowBlur = 3;
            context.shadowColor = '#2c3e50';
            context.fillStyle = '#34495e';
        } else if (points[i].state == 1) {
            context.shadowBlur = 3;
            context.shadowColor = '#2980b9';
            context.fillStyle = '#3498db';
        }
        context.beginPath();
        context.arc(points[i].x, points[i].y, points[i].frame / 10, 0, 2*Math.PI);
        context.closePath();
        context.fill();
        if (points[i].frame - 8 > 100) {
            points[i].frame -= 8;
        }
    }
    requestAnimationFrame(render);
}


/*******************************
    HELPER FUNCTIONS
*******************************/
function printPoints() {
    for (var i = 0; i < points.length; i++) {
        console.log(points[i].x + ", " + points[i].y + ", " + points[i].angle);
    }
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
        context.clearRect(0, 0, canvas.width, canvas.height);
        points = new Array();
        $(this).text('Solve');
    }
})

$('#canvas').click(function(e) {
    var offset = $(this).offset();
    var clickX = e.pageX - offset.left;
    var clickY = e.pageY - offset.top;
    drawPoint(clickX, clickY);
})

$(document).ready(function() {
    $('#canvas').attr('height', $('#canvas').css('height'));
    $('#canvas').attr('width', $('#canvas').css('width'));
    render();
})