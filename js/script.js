
// Connect the Dots | Galen Scovell, 05/21/15 //


function drawPoint(x, y) {
    console.log(x, y);
    context.beginPath();
    context.arc(x, y, 6, 0, 2*Math.PI);
    context.stroke();
    context.closePath();
}

$('#canvas').click(function(e) {
    var offset = $(this).offset();
    var clickX = e.pageX - offset.left;
    var clickY = e.pageY - offset.top;
    drawPoint(clickX, clickY);
});

$(document).ready(function() {
    $('#canvas').attr('height', $('#canvas').css('height'));
    $('#canvas').attr('width', $('#canvas').css('width'));
})

// Global variables
var context = $('#canvas')[0].getContext("2d");