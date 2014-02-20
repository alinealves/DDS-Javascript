html5.getCanvas2dContext("main_canvas");

graph = new Graph();

var tx=0,ty=html5.canvas.height/2;
var sx=1,sy=1;
var n = 10;
var i = 0;
graph.points.push (new vec2 (i*n,0));

function clearScreen () {
    var ctx = html5.context;

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect (0,0,html5.canvas.width,html5.canvas.height);
}

var k = 1;

function addPoint () {
    i++;
    if (i < 3600)
        graph.addPoint (new vec2 (i/10,values[i%360]*10));
}

function update () {
    html5.updateTime()

    clearScreen();
    graph.draw();

    if (!html5.keyboard[html5.keyShift]) {
        if (html5.keyboard[html5.keyUp] || html5.mouseWheel > 0) {
            if (graph.sx < 10) {
                graph.zoom(+0.5);
            }
        }
        if (html5.keyboard[html5.keyDown] || html5.mouseWheel < 0) {
            if (graph.sx > 0.5) {
                graph.zoom (-0.5);
            }
        }
    } else {
        if (html5.keyboard[html5.keyS])
            graph.scrollY(html5.mouseWheel/graph.sy*10);
        else
            graph.scroll(html5.mouseWheel/graph.sx*10);
    }

 
    html5.mouseWheel = 0;
}

if (html5.context) {
    graph.center(graph.sx,graph.sy);
    setInterval (update, 0);
    setInterval (addPoint, 30);
}

function windowResize () {
    var w = $(window).width();
    var h = $(window).height();

    $("html_canvas").css("height",w+"px");
    $("html_canvas").css("width",h+"px");
    html5.canvas.width = w;
    html5.canvas.height = h;
}

windowResize();

$(window).resize (windowResize);
