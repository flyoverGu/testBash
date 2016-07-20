var ctxt;

var readImg = function(url, done) {
    var canvas = document.getElementById('canvas');
    ctxt = canvas.getContext('2d');
    var img = new Image;
    img.onload = function() {
        var h = this.height;
        var w = this.width;
        canvas.width = w;
        canvas.height = h;
        ctxt.drawImage(img, 0, 0, w, h);
        var imgData = ctxt.getImageData(0, 0, w, h);
        var data = imgData.data;
        done && done(data, w, h);
        ctxt.putImageData(imgData, 0, 0);
    }
    img.src = url;
}


var writeLine = function(data, w, h, xh) {
    let s = 4 * w * xh;
    let m = s + 4 * w;
    for (var index = s; index < m; index += 4) {
        data[index] = 255;
        data[index + 1] = 0;
        data[index + 2] = 0;
    }
}


var src = './img/1.jpg';
//var src = './img/2.jpg';
//var src = './img/3.png';
//var src = './img/4.png';
//var src = './img/5.jpg';
//var src = './img/6.jpg';


$('#button').on('click', function() {
    var url = $('#input').val();
    $.getJSON('http://127.0.0.1:8877/slice?height=600&filePath=' + url + '', (list) => {
        console.log(list);
        readImg(url, function(data, w, h) {
            list.map(item => {
                writeLine(data, w, h, item);
            });
        });
    });
});
