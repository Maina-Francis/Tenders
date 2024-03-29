"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
exports.TodoService = void 0;
var common_1 = require("@nestjs/common");
var microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
var mongoose_1 = require("@nestjs/mongoose");
var TodoService = /** @class */ (function () {
    function TodoService(httpService, todoModel) {
        var _this = this;
        this.httpService = httpService;
        this.todoModel = todoModel;
        this.graphClient = microsoft_graph_client_1.Client.init({
            authProvider: function (done) {
                _this.getAccessToken()
                    .then(function (token) { return done(null, token); })["catch"](function (error) { return done(error, null); });
            }
        });
        //Create the task list when the service is initialized
        this.createTaskList();
    }
    // Retrieve access token using client credentials
    TodoService.prototype.getAccessToken = function () {
        return __awaiter(this, void 0, Promise, function () {
            var requestBody, response, accessToken, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestBody = "client_id=" + encodeURIComponent(process.env.client_id) + "&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret=" + encodeURIComponent(process.env.TenderSecret) + "&grant_type=client_credentials";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.httpService
                                .post("https://login.microsoftonline.com/" + process.env.tenant_id + "/oauth2/v2.0/token", requestBody, {
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                            })
                                .toPromise()];
                    case 2:
                        response = _a.sent();
                        accessToken = response.data.access_token;
                        // console.log('Access Token ', accessToken);
                        return [2 /*return*/, accessToken];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error fetching access token:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TodoService.prototype.createTaskList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken, options, listEndpoint, existingLists, tenderList, list, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAccessToken()];
                    case 1:
                        accessToken = _a.sent();
                        options = {
                            headers: {
                                Authorization: "Bearer " + accessToken
                            }
                        };
                        listEndpoint = "https://graph.microsoft.com/v1.0/users/" + process.env.user_id + "/todo/lists";
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this.graphClient.api(listEndpoint).get()];
                    case 3:
                        existingLists = _a.sent();
                        tenderList = existingLists.value.find(function (list) { return list.displayName === 'New Tenders'; });
                        if (tenderList) {
                            this.taskListId = tenderList.id;
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.graphClient.api(listEndpoint).post(__assign({ displayName: 'New Tenders' }, options))];
                    case 4:
                        list = _a.sent();
                        this.taskListId = list.id;
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.error('Error creating task list:', error_2);
                        throw error_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    TodoService.prototype.createTodoListFromCollection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var todos, accessToken, options, tasksEndpoint, createdTodos, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.todoModel.find({}).exec()];
                    case 1:
                        todos = _a.sent();
                        return [4 /*yield*/, this.getAccessToken()];
                    case 2:
                        accessToken = _a.sent();
                        options = {
                            headers: {
                                Authorization: "Bearer " + accessToken
                            }
                        };
                        tasksEndpoint = "https://graph.microsoft.com/v1.0/users/" + process.env.user_id + "/todo/lists/" + this.taskListId + "/tasks";
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, Promise.all(todos.map(function (todo) { return __awaiter(_this, void 0, void 0, function () {
                                var task;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.graphClient.api(tasksEndpoint).post(__assign({ title: todo.title, body: {
                                                    content: "Procuring Entity: " + todo.pename + "\n              Procurement Method: " + todo.procurementmethod + "\n              Submission Method: " + todo.submissionmethod + "\n              Closing Date: " + todo.closedate + "\n              Financial Year: " + todo.financialyr + "\n              Addendum Added: " + todo.addendumadded + "\n              Link To Tender: https://tenders.go.ke/OneTender/" + todo.id_tenderdetails,
                                                    contentType: 'text'
                                                } }, options))];
                                        case 1:
                                            task = _a.sent();
                                            return [2 /*return*/, task];
                                    }
                                });
                            }); }))];
                    case 4:
                        createdTodos = _a.sent();
                        return [2 /*return*/, { todos: createdTodos }];
                    case 5:
                        error_3 = _a.sent();
                        console.error('An error occurred:', error_3);
                        throw error_3;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    TodoService = __decorate([
        common_1.Injectable(),
        __param(1, mongoose_1.InjectModel('newTenders'))
    ], TodoService);
    return TodoService;
}());
exports.TodoService = TodoService;
