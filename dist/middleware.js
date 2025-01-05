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
exports.validateGroupAccess = validateGroupAccess;
exports.groupExists = groupExists;
exports.createGroupDirectory = createGroupDirectory;
var fs = require("fs/promises");
var path = require("path");
var GROUPS_DIR = path.join(__dirname, 'groups');
var GROUPS_FILE = path.join(__dirname, '../groups.json');
var groupCache = [];
function updateGroupCache() {
    return __awaiter(this, void 0, void 0, function () {
        var directories, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.readdir(GROUPS_DIR)];
                case 1:
                    directories = _a.sent();
                    groupCache = directories.filter(function (dir) { return __awaiter(_this, void 0, void 0, function () {
                        var stat;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fs.stat(path.join(GROUPS_DIR, dir))];
                                case 1:
                                    stat = _a.sent();
                                    return [2 /*return*/, stat.isDirectory()];
                            }
                        });
                    }); });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error updating group cache:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Initial cache population
updateGroupCache();
// Update cache every 5 minutes
setInterval(updateGroupCache, 5 * 60 * 1000);
function validateGroupAccess(req, res, next) {
    var requestedPath = req.path;
    var groupMatch = requestedPath.match(/\/groups\/([^\/]+)/);
    if (!groupMatch) {
        return next(); // Not a group request, continue
    }
    var requestedGroup = groupMatch[1];
    var token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    if (!groupCache.includes(requestedGroup)) {
        return res.status(404).json({ error: 'Group not found' });
    }
    // Get stored token from localStorage for this group
    var storedToken = localStorage.getItem("groupToken_".concat(requestedGroup));
    if (token !== storedToken) {
        return res.status(403).json({ error: 'Invalid token for this group' });
    }
    next();
}
// Helper to check if a group exists
function groupExists(groupName) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.access(path.join(GROUPS_DIR, groupName))];
                case 1:
                    _b.sent();
                    return [2 /*return*/, true];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Helper to create a new group directory
function createGroupDirectory(groupName) {
    return __awaiter(this, void 0, void 0, function () {
        var groupPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    groupPath = path.join(GROUPS_DIR, groupName);
                    return [4 /*yield*/, fs.mkdir(groupPath, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, updateGroupCache()];
                case 2:
                    _a.sent(); // Update cache after creating new directory
                    return [2 /*return*/];
            }
        });
    });
}
