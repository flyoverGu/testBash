'use strict';

let fs = require('fs');
let readImage = require('./readImage');

let dbSlice = (n, list) => {
    let diffList = [];
    let resList = [];
    let db = 0;
    list.reduce((pre, cur) => {
        diffList.push(cur - pre);
        return cur;
    }, 0);
    diffList.map((h, index) => {
        if (db + h <= n) {
            db += h;
        } else {
            db = h;
            let xh = list[index - 1];
            xh && resList.push(xh);
        }
    });
    return resList;
}

let getTwoLine = function(data, w, xh) {
    let s = 4 * w * xh;
    let m = s + 4 * w;
    let e = m + 4 * w;
    if (data.length < e) {
        return;
    } else {
        let list1 = data.slice(s, m);
        let list2 = data.slice(m, e);
        return [list1, list2];
    }
}

let compare = function(list1, list2, eff) {
    for (let index = 0; index < list1.length; index++) {
        let diff = list1[index] - list2[index];
        diff < 0 && (diff = -diff);
        if (diff > eff) return false;
    }
    return true;
}

let violenceSlice = function(data, w, sh, eh, eff) {
    let resList = [];
    for (let index = sh; index < eh; index += 10) {
        let list = getTwoLine(data, w, index);
        if (!list) {
            //console.log(sh, eh, eff, index);
            break;
        }
        let isSame = compare(list[0], list[1], eff);
        if (isSame) {
            resList.push(index);
        }
    }
    resList.push(eh);
    return resList;
}

let getOverLimitList = function(list, n, sh) {
    let diffList = [];
    let overLimitList = [];
    list.reduce((pre, cur) => {
        let diff = cur - pre;
        diffList.push(diff);
        if (diff > n) {
            overLimitList.push({
                sh: pre,
                eh: cur
            });
        }
        return cur;
    }, sh);
    return overLimitList;
}

let addList = function(srcList, list) {
    var map = {};
    srcList.map(item => {
        map[item] = 1;
    });
    list.map(item => {
        if (!map[item]) srcList.push(item);
    });
    //console.log('44444', srcList);
    srcList.sort((a, b) => {
        return a - b;
    });
    //console.log('55555', srcList);
}

let splice = function(data, w, h, n) {
    let effList = [5, 10, 15, 20, 30];
    let resList = [];
    let eff;
    let sh = 0;
    let eh = h;
    let q = [{
        sh: 0,
        eh: h
    }];
    let cq;
    while (eff = effList.shift()) {
        //console.log('切割效率: ', eff);
        let overLimitList = [];
        while (cq = q.shift()) {
            //console.log('当前切割: ', cq);
            let list = violenceSlice(data, w, cq.sh, cq.eh, eff);
            addList(resList, list);
            let overList = getOverLimitList(list, n, cq.sh);
            //console.log('超出范围: ', overList);
            overLimitList = overLimitList.concat(overList);
        }
        //console.log('切割线: ', resList, resList.length);
        if (!overLimitList.length) break;
        overLimitList.map(i => q.push(i));
    }
    return dbSlice(n, resList);
}

module.exports = (opt, done) => {
    readImage(opt.filePath, (err, data, w, h) => {
        if (err) {
            done && done(err);
        } else {
            done && done(null, splice(data, w, h, opt.height || 300));
        }
    });
}

//dbSlice(400, [80, 90, 100, 110, 120, 190, 240, 550, 560, 600, 660, 670, 680, 690, 700]);
