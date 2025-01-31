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
exports.Handle = void 0;
var fs = require("fs/promises");
var path = require("path");
var crypto = require("crypto");
var middleware_1 = require("./middleware");
var Handle = /** @class */ (function () {
    function Handle() {
        this.groupsFilePath = path.join(__dirname, '../groups.json');
    }
    Handle.prototype.ensureGroupsFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, fs.access(this.groupsFilePath)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        _a = _b.sent();
                        // File doesn't exist, create it with default structure
                        return [4 /*yield*/, fs.writeFile(this.groupsFilePath, JSON.stringify({ Groups: [] }, null, 2))];
                    case 3:
                        // File doesn't exist, create it with default structure
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Handle.prototype.readGroupsFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureGroupsFile()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.readFile(this.groupsFilePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        return [2 /*return*/, JSON.parse(data)];
                    case 4:
                        err_1 = _a.sent();
                        console.error('Error reading groups.json:', err_1);
                        return [2 /*return*/, { Groups: [] }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Handle.prototype.writeGroupsFile = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs.writeFile(this.groupsFilePath, JSON.stringify(data, null, 2), { flag: 'w' })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        console.error('Error writing to groups.json:', err_2);
                        throw new Error('Failed to update groups.json');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Handle.prototype.handle = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var result, normalizeString, loginRequest_1, groupsData, matchingGroup, token, signupRequest, groupsData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Handling message:', message);
                        result = {};
                        normalizeString = function (str) {
                            return str.toLowerCase().replace(/\s+/g, '');
                        };
                        if (!('LoginRequest' in message)) return [3 /*break*/, 2];
                        loginRequest_1 = {
                            GroupName: normalizeString(message.LoginRequest.GroupName),
                            GroupPassword: normalizeString(message.LoginRequest.GroupPassword),
                            Name: normalizeString(message.LoginRequest.Name),
                        };
                        return [4 /*yield*/, this.readGroupsFile()];
                    case 1:
                        groupsData = _a.sent();
                        matchingGroup = groupsData.Groups.find(function (group) {
                            return (normalizeString(group.GroupName) === loginRequest_1.GroupName &&
                                normalizeString(group.GroupPassword) === loginRequest_1.GroupPassword &&
                                group.names.map(normalizeString).includes(loginRequest_1.Name));
                        });
                        if (matchingGroup) {
                            token = crypto.randomBytes(32).toString('hex');
                            console.log('Login successful for:', loginRequest_1.Name);
                            result = {
                                LoginSuccessful: matchingGroup.GroupName,
                                Name: loginRequest_1.Name,
                                Password: loginRequest_1.GroupPassword,
                                token: token
                            };
                        }
                        else {
                            console.log('Invalid login credentials for:', loginRequest_1.Name);
                            result = { InvalidCredentials: true };
                        }
                        return [3 /*break*/, 10];
                    case 2:
                        if (!('SignupRequest' in message)) return [3 /*break*/, 9];
                        signupRequest = {
                            GroupName: normalizeString(message.SignupRequest.GroupName),
                            GroupPassword: normalizeString(message.SignupRequest.GroupPassword),
                            Names: message.SignupRequest.Names.map(normalizeString),
                        };
                        return [4 /*yield*/, this.readGroupsFile()];
                    case 3:
                        groupsData = _a.sent();
                        return [4 /*yield*/, (0, middleware_1.groupExists)(signupRequest.GroupName)];
                    case 4:
                        if (!_a.sent()) return [3 /*break*/, 5];
                        console.log('Group already exists:', message.SignupRequest.GroupName);
                        result = { GroupAlreadyExists: message.SignupRequest.GroupName };
                        return [3 /*break*/, 8];
                    case 5:
                        groupsData.Groups.push({
                            GroupName: message.SignupRequest.GroupName, // Keep original case
                            GroupPassword: message.SignupRequest.GroupPassword,
                            names: message.SignupRequest.Names,
                        });
                        return [4 /*yield*/, this.writeGroupsFile(groupsData)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, (0, middleware_1.createGroupDirectory)(message.SignupRequest.GroupName)];
                    case 7:
                        _a.sent();
                        console.log('New group created:', message.SignupRequest.GroupName);
                        result = { GroupMade: true };
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        console.error('Unknown request type:', message);
                        result = { Error: 'Unknown request type' };
                        _a.label = 10;
                    case 10: return [2 /*return*/, result];
                }
            });
        });
    };
    return Handle;
}());
exports.Handle = Handle;
