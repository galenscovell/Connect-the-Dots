
// Connect the Dots | Galen Scovell, 05/21/15 //

// Line connecting: Find point n -> point with largest y-coordinate (furthest down).
//                  Sort all other points by their polar angle with point n.
//                  Connect points in order.


var context = $('#canvas')[0].getContext("2d");
var points = new Array();


function connectPoints() {
    findStartingPoint();
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
    context.beginPath();
    context.arc(startingPoint.x, startingPoint.y, 6, 0, 2*Math.PI);
    context.closePath();
    context.fill();
}

function drawPoint(pointX, pointY) {
    console.log(pointX, pointY);
    context.beginPath();
    context.arc(pointX, pointY, 6, 0, 2*Math.PI);
    context.stroke();
    context.closePath();
    points.push({x:pointX, y:pointY});
}

function printPoints() {
    for (var i = 0; i < points.length; i++) {
        console.log(points[i].x + ", " + points[i].y);
    }
}

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
})