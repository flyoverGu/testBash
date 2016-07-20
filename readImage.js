'use strict';

let fs = require('fs');
let Canvas = require('canvas');
let Image = Canvas.Image;
let canvas = new Canvas(200, 200);
let ctx = canvas.getContext('2d');

let isFile = (filePath) => {
    try {
        let stat = fs.statSync(filePath);
        if (stat.isFile()) return true;
        return false;
    } catch (e) {
        return false;
    }
}

module.exports = (filePath, done) => {
    if (!isFile(filePath)) {
        done && done(new Error('not found file'));
        return;
    }
    fs.readFile(filePath, (err, data) => {
        let img = new Image;
        img.src = data;
        let h = img.height;
        let w = img.width;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        let dataMap = ctx.getImageData(0, 0, w, h).data;
        let list = [];
        for (let index = 0; index < dataMap.length; index++) {
            list.push(dataMap[index]);
        }
        done && done(null, list, w, h);
    });
}
