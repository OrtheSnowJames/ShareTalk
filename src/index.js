"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var fs = require("fs");
var path = require("path");
var handle_1 = require("./handle");
console.log('Happy developing ✨');
var hostname = 'localhost';
var port = 3000;
var tokens = new Set();
function generateToken() {
    return Math.random().toString(36).substr(2);
}
function authenticate(req) {
    var token = req.headers['authorization'];
    return typeof token === 'string' && tokens.has(token);
}
function sendFile(res, filePath, contentType) {
    var fullPath = path.join(__dirname, filePath);
    // Read the file asynchronously
    fs.readFile(fullPath, function (err, data) {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end("Error reading file: ".concat(err.message));
            return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        res.end(data);
    });
}
var server = http.createServer(function (req, res) {
    var _a, _b;
    if (req != null) {
        console.log("Request for ".concat(req.url));
    }
    if (req.method === 'POST' && req.url === '/submit') {
        var body_1 = '';
        req.on('data', function (chunk) {
            body_1 += chunk;
        });
        req.on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleInstance, parsedData, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        handleInstance = new handle_1.Handle();
                        parsedData = JSON.parse(body_1);
                        if (!parsedData.message) {
                            throw new Error('Invalid request format: missing message');
                        }
                        return [4 /*yield*/, handleInstance.handle(parsedData.message)];
                    case 1:
                        result = _a.sent();
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(result));
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error processing request:', error_1);
                        res.statusCode = 400;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({
                            Error: error_1.message || 'An unknown error occurred'
                        }));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        return; // Ensure no further response handling occurs
    }
    // this is to ensure people don't get private items instead of just sending everything to the client
    if (req.method === 'GET' && req.url === '/api/group-data') {
        var token = req.headers['authorization'];
        var groupId_1 = req.headers['group-id'];
        if (!token || !groupId_1) {
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
            var groupPath = path.join(__dirname, 'grpsrc', groupId_1.toString());
            fs.access(groupPath, fs.constants.R_OK, function (err) {
                if (err) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Group not found' }));
                    return;
                }
                // Use relative path for sending files
                sendFile(res, "./grpsrc/".concat(groupId_1, "/info.json"), 'application/json');
            });
        }
        catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Server error' }));
        }
    }
    if (req.url === '/') {
        sendFile(res, '../client/index.html', 'text/html');
    }
    else if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith("/groups")) {
        var groupPath = req.url.substring(1); // Remove the leading slash
        var isAuthenticated = authenticate(req);
        if (isAuthenticated) {
            if (req.url.endsWith('.js')) {
                sendFile(res, "./groups/".concat(groupPath), 'application/javascript');
            }
            else {
                sendFile(res, "./groups/".concat(groupPath), 'text/html');
            }
        }
        else {
            res.writeHead(302, { 'Location': '/404/' });
            res.end();
        }
    }
    else if ((_b = req.url) === null || _b === void 0 ? void 0 : _b.startsWith("/assets")) {
        var assetPath = req.url.substring(1); // Remove the leading slash
        var ext = path.extname(assetPath).toLowerCase();
        var contentType = 'application/octet-stream';
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
        sendFile(res, "../".concat(assetPath), contentType);
    }
    else if (req.url === '/client.js') {
        sendFile(res, '../client/client.js', 'application/javascript');
    }
    else if (req.url === '/thestylesheet.css' || req.url === '/client/thestylesheet.css') {
        sendFile(res, '../client/thestylesheet.css', 'text/css');
    }
    else if (req.url === '/404/') {
        sendFile(res, '../client/notfound.html', 'text/html');
    }
    else if (req.url === '/about/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>About Us</h1><p>Share talk is a browser site where groups can get together and post and comment on photos and videos.</p>');
    }
    else if (req.url == '/favicon.ico') {
        sendFile(res, '../assets/favicon.ico', 'image/x-icon');
    }
    else if (req.url === '/login') {
        var token = generateToken();
        tokens.add(token);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ token: token }));
    }
    else if (req.url === '/logout' && req.method === 'POST') {
        var token = req.headers['authorization'];
        if (token && tokens.has(token)) {
            tokens.delete(token);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Logged out successfully' }));
        }
        else {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Invalid token' }));
        }
    }
    else {
        res.writeHead(302, { 'Location': '/404/' });
        res.end();
    }
});
server.listen(port, hostname, function () {
    console.log("Server running at http://".concat(hostname, ":").concat(port, "/"));
});
