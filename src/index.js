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
var hostname = 'localhost';
var port = 3000;
function sendFile(res, filePath, contentType) {
    var fullPath = path.join(__dirname, filePath);
    // Read the file asynchronously
    fs.readFile(fullPath, 'utf8', function (err, data) {
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
    if (req != null) {
        console.log("Request for ".concat(req.url));
    }
    if (req.method === 'POST' && req.url === '/submit') {
        var body_1 = '';
        req.on('data', function (chunk) {
            body_1 += chunk;
        });
        req.on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleInstance, parsedData, _a, GroupName, GroupPassword, Names, result, _b, GroupName, GroupPassword, Name, result, error_1;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 6, , 7]);
                        handleInstance = new handle_1.Handle();
                        parsedData = JSON.parse(body_1);
                        console.log('Received data:', parsedData);
                        if (!((_c = parsedData.message) === null || _c === void 0 ? void 0 : _c.SignupRequest)) return [3 /*break*/, 2];
                        _a = parsedData.message.SignupRequest, GroupName = _a.GroupName, GroupPassword = _a.GroupPassword, Names = _a.Names;
                        console.log('SignupRequest details:', { GroupName: GroupName, GroupPassword: GroupPassword, Names: Names });
                        return [4 /*yield*/, handleInstance.handle({
                                type: 'SignupRequest',
                                GroupName: GroupName,
                                GroupPassword: GroupPassword,
                                Names: Names,
                            })];
                    case 1:
                        result = _e.sent();
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(result));
                        return [3 /*break*/, 5];
                    case 2:
                        if (!((_d = parsedData.message) === null || _d === void 0 ? void 0 : _d.LoginRequest)) return [3 /*break*/, 4];
                        _b = parsedData.message.LoginRequest, GroupName = _b.GroupName, GroupPassword = _b.GroupPassword, Name = _b.Name;
                        console.log('LoginRequest details:', { GroupName: GroupName, GroupPassword: GroupPassword, Name: Name });
                        return [4 /*yield*/, handleInstance.handle({
                                type: 'LoginRequest',
                                GroupName: GroupName,
                                GroupPassword: GroupPassword,
                                Name: Name,
                            })];
                    case 3:
                        result = _e.sent();
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(result));
                        return [3 /*break*/, 5];
                    case 4: throw new Error('Invalid request format');
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _e.sent();
                        console.error('Error processing request:', error_1);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end("Error processing request: ".concat(error_1.message));
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        return; // Ensure no further response handling occurs
    }
    if (req.url === '/') {
        sendFile(res, '../client/index.html', 'text/html');
    }
    else if (req.url === '/client.js') {
        sendFile(res, '../client/client.js', 'application/javascript');
    }
    else if (req.url === '/404/') {
        sendFile(res, '../client/notfound.html', 'text/html');
    }
    else if (req.url === '/about/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>About Us</h1><p>Share talk is a browser site where groups can get together and post and comment on photos and videos.</p>');
    }
    else {
        res.writeHead(302, { 'Location': '/404/' });
        res.end();
    }
});
server.listen(port, hostname, function () {
    console.log("Server running at http://".concat(hostname, ":").concat(port, "/"));
});
