'use strict';

let http = require('http');
let url = require('url');
let slice = require('./slice');

let app = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    let u = url.parse(req.url);
    // router
    if (/^\/slicePic/i.test(u.path)) {
        try {
            let queryObj = {};
            queryObj = parseQuery(u.query);
            slice(queryObj, (err, list) => {
                if (err) {
                    res.writeHead(502);
                    res.end(err.message);
                } else {
                    res.end(JSON.stringify(list));
                }
            });
        } catch (e) {
            res.writeHead(502);
            res.end('params error', e.message);
        }
    } else {
        res.writeHead(404);
        res.end('not found !!');
    }
});

let parseQuery = (queryStr) => {
    let obj = {};
    queryStr && queryStr.split('&').map((item) => {
        if (item) {
            let kv = item.split('=');
            obj[kv[0]] = kv[1];
        }
    });
    return obj;
}

app.listen(8877, () => {
    console.log('server start port 8877');
});
