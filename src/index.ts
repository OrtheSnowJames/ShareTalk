import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { Handle } from './handle';
import { send } from 'process';
console.log('Happy developing ✨');

const hostname = 'localhost';
const port = 3000;

const tokens = new Set<string>();

function generateToken(): string {
    return Math.random().toString(36).substr(2);
}

function authenticate(req: http.IncomingMessage): boolean {
    const token = req.headers['authorization'];
    return typeof token === 'string' && tokens.has(token);
}

function sendFile(res: http.ServerResponse, filePath: string, contentType: string): void {
    const fullPath = path.join(__dirname, filePath);

    // Read the file asynchronously
    fs.readFile(fullPath, (err, data) => {
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

                if (!parsedData.message) {
                    throw new Error('Invalid request format: missing message');
                }

                const result = await handleInstance.handle(parsedData.message);
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result));
            } catch (error) {
                console.error('Error processing request:', error);
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 
                    Error: (error as Error).message || 'An unknown error occurred'
                }));
            }
        });        
        return; // Ensure no further response handling occurs
    }
    // this is to ensure people don't get private items instead of just sending everything to the client
    if (req.method === 'GET' && req.url === '/api/group-data') {
        const token = req.headers['authorization'];
        const groupId = req.headers['group-id'];

        if (!token || !groupId) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing token or group ID' }));
            return;
        }

        if (!authenticate(req)) {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid token' }));
            return;
        }

        try {
            const groupPath = path.join(__dirname, 'grpsrc', groupId.toString());
            fs.access(groupPath, fs.constants.R_OK, (err) => {
                if (err) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Group not found' }));
                    return;
                }

                // Use relative path for sending files
                sendFile(res, `./grpsrc/${groupId}/info.json`, 'application/json');
            });
        } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Server error' }));
        }
    }
    if (req.url === '/') {
        sendFile(res, '../client/index.html', 'text/html');
    } else if (req.url?.startsWith("/groups")) {
        const groupPath = req.url.substring(1); // Remove the leading slash
        const isAuthenticated = authenticate(req);
        if (isAuthenticated) {
            if (req.url.endsWith('.js')) {
                sendFile(res, `./groups/${groupPath}`, 'application/javascript');
            } else {
                sendFile(res, `./groups/${groupPath}`, 'text/html');
            }
        } else {
            res.writeHead(302, { 'Location': '/404/' });
            res.end();
        }
    } else if (req.url?.startsWith("/assets")) {
        const assetPath = req.url.substring(1); // Remove the leading slash
        const ext = path.extname(assetPath).toLowerCase();
        let contentType = 'application/octet-stream';

        switch (ext) {
            case '.js':
                contentType = 'application/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.html':
                contentType = 'text/html';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.svg':
                contentType = 'image/svg+xml';
                break;
        }

        sendFile(res, `../${assetPath}`, contentType);
    } else if (req.url === '/client.js') {
        sendFile(res, '../client/client.js', 'application/javascript');
    } else if (req.url === '/thestylesheet.css' || req.url === '/client/thestylesheet.css') {
        sendFile(res, '../client/thestylesheet.css', 'text/css');
    } else if (req.url === '/404/') {
        sendFile(res, '../client/notfound.html', 'text/html');
    } else if (req.url === '/about/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>About Us</h1><p>Share talk is a browser site where groups can get together and post and comment on photos and videos.</p>');
    } else if (req.url == '/favicon.ico') {
        sendFile(res, '../assets/favicon.ico', 'image/x-icon');
    } else if (req.url === '/login') {
        const token = generateToken();
        tokens.add(token);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ token }));
    } else if (req.url === '/logout' && req.method === 'POST') {
        const token = req.headers['authorization'];
        if (token && tokens.has(token)) {
            tokens.delete(token);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Logged out successfully' }));
        } else {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Invalid token' }));
        }
    } else {
        res.writeHead(302, { 'Location': '/404/' });
        res.end();
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});