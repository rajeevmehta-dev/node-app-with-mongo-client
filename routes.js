const fs = require('fs');
const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    console.log(url);
    if (url === '/') {
        res.write("<html>");
        res.write("<head><title> Enter a Message</title></head>");
        res.write('<body><form action= "/message" method = "post"><input type ="text" name = "message"> <button type ="submit" name = "send">Send</button></form></body>');
        res.write("</html");
        console.log('first thing');
        return res.end();
    }
    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
         return req.on('end', () => {
            console.log('run end');
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.writeFile('message.txt', message, err => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            })
        });
        }
        console.log('run state code');
        res.setHeader('content-type', 'text/html');
        res.write('<html>');
        res.write('<head><title>My first page</title></head>');
        res.write('<body><h1> Hello from node js server<h1>/');
        res.write('</body>');
        res.write('</html>');
        res.end();
    }
module.exports = requestHandler;