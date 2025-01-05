import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { Handle } from './handle';

const hostname = 'localhost';
const port = 3000;

function sendFile(res: http.ServerResponse, filePath: string, contentType: string): void {
    const fullPath = path.join(__dirname, filePath);

    // Read the file asynchronously
    fs.readFile(fullPath, 'utf8', (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end(`Error reading file: ${err.message}`);
            return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        res.end(data);
    });
}

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req != null) {
        console.log(`Request for ${req.url}`);
    }
    if (req.method === 'POST' && req.url === '/submit') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', async () => {
            try {
                const handleInstance = new Handle();
                const parsedData = JSON.parse(body);
        
                console.log('Received data:', parsedData);
        
                if (parsedData.message?.SignupRequest) {
                    const { GroupName, GroupPassword, Names } = parsedData.message.SignupRequest;
                    console.log('SignupRequest details:', { GroupName, GroupPassword, Names });
        
                    const result = await handleInstance.handle({
                        type: 'SignupRequest',
                        GroupName,
                        GroupPassword,
                        Names,
                    });
        
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(result));
                } else if (parsedData.message?.LoginRequest) {
                    const { GroupName, GroupPassword, Name } = parsedData.message.LoginRequest;
                    console.log('LoginRequest details:', { GroupName, GroupPassword, Name });
        
                    const result = await handleInstance.handle({
                        type: 'LoginRequest',
                        GroupName,
                        GroupPassword,
                        Name,
                    });
        
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(result));
                } else {
                    throw new Error('Invalid request format');
                }
            } catch (error) {
                console.error('Error processing request:', error);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`Error processing request: ${(error as Error).message}`);
            }
        });        
        return; // Ensure no further response handling occurs
    }

    if (req.url === '/') {
        sendFile(res, '../client/index.html', 'text/html');
    } else if (req.url === '/client.js') {
        sendFile(res, '../client/client.js', 'application/javascript');
    } else if (req.url === '/404/') {
        sendFile(res, '../client/notfound.html', 'text/html');
    } else if (req.url === '/about/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>About Us</h1><p>Share talk is a browser site where groups can get together and post and comment on photos and videos.</p>');
    } else {
        res.writeHead(302, { 'Location': '/404/' });
        res.end();
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});