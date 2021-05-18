const http = require('http')
const fs = require('fs')
const path = require('path')
const port = process.env.PORT || 3000


const server = http.createServer((req, res) => {
    console.log('req ', decodeURI(req.url))

    let filePath = '.' + decodeURI(req.url)
    //server .index.html by default
    if (filePath == './') {
        filePath = './' + 'index.html'
    }

    let extname = String(path.extname(filePath)).toLowerCase()
    let mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };

    let contentType = mimeTypes[extname] || 'application/octet-stream'

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            if (err.code == 'ENOENT') {
                fs.readFile('./404.html', (err, data) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' })
                    res.end(data, 'utf-8')
                });
            }
            else {
                res.writeHead(500)
                res.end('Error 500: ' + err.code)
            }
        }
        // else if (contentType == 'application/octet-stream') {
        //     res.writeHead(200, { 'Content-Type': contentType })
        //     res.end(data, 'utf-8')
        // }
        else {
            res.setHeader('Cache-Control', 'no-store')
            res.writeHead(200, { 'Content-Type': contentType })
            res.end(data, 'utf-8')
        }
    });

})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})