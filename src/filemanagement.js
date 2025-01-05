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
exports.readGroupsFile = readGroupsFile;
exports.writeGroupsFile = writeGroupsFile;
exports.writeFile = writeFile;
exports.readFile = readFile;
exports.deleteFile = deleteFile;
exports.readDir = readDir;
var fs = require("fs/promises");
function readGroupsFile() {
    return __awaiter(this, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.readFile('./groups.json', 'utf8')];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, JSON.parse(data)];
                case 2:
                    err_1 = _a.sent();
                    console.error('Error reading groups.json:', err_1);
                    return [2 /*return*/, { Groups: [] }]; // Default empty structure if file doesn't exist or is malformed
                case 3: return [2 /*return*/];
            }
        });
    });
}
;
// Write data back to groups.json safely
function writeGroupsFile(data) {
    return __awaiter(this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.writeFile('./groups.json', JSON.stringify(data, null, 2))];
                case 1:
                    _a.sent();
                    console.log('groups.json updated successfully');
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    console.error('Error writing to groups.json:', err_2);
                    throw new Error('Failed to update groups.json');
                case 3: return [2 /*return*/];
            }
        });
    });
}
;
function writeFile(filePath, data) {
    return __awaiter(this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(data, null, 2))];
                case 1:
                    _a.sent();
                    console.log("".concat(filePath, " updated successfully"));
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    console.error("Error writing to ".concat(filePath, ":"), err_3);
                    throw new Error("Failed to update ".concat(filePath));
                case 3: return [2 /*return*/];
            }
        });
    });
}
function readFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var data, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, JSON.parse(data)];
                case 2:
                    err_4 = _a.sent();
                    console.error("Error reading ".concat(filePath, ":"), err_4);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function deleteFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.unlink(filePath)];
                case 1:
                    _a.sent();
                    console.log("".concat(filePath, " deleted successfully"));
                    return [3 /*break*/, 3];
                case 2:
                    err_5 = _a.sent();
                    console.error("Error deleting ".concat(filePath, ":"), err_5);
                    throw new Error("Failed to delete ".concat(filePath));
                case 3: return [2 /*return*/];
            }
        });
    });
}
function readDir(dirPath) {
    return __awaiter(this, void 0, void 0, function () {
        var err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.readdir(dirPath)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_6 = _a.sent();
                    console.error("Error reading directory ".concat(dirPath, ":"), err_6);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
