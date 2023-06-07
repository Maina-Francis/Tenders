"use strict";
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
exports.TenderService = void 0;
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var filter_keywords_1 = require("./filters/filter.keywords");
var mongoose_1 = require("@nestjs/mongoose");
var tender_schema_1 = require("./schemas/tender.schema");
var schedule_1 = require("@nestjs/schedule");
var TenderService = /** @class */ (function () {
    function TenderService(tenderModel, newTenderModel, httpService, todoService) {
        this.tenderModel = tenderModel;
        this.newTenderModel = newTenderModel;
        this.httpService = httpService;
        this.todoService = todoService;
    }
    //   Get all open tenders filtered by keywords
    TenderService.prototype.getTenders = function () {
        return __awaiter(this, void 0, Promise, function () {
            var url, data, filteredData, _loop_1, _i, data_1, tender, i, checkFromDb;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Delete everything in the newTenders collection
                    return [4 /*yield*/, this.newTenderModel.deleteMany({})];
                    case 1:
                        // Delete everything in the newTenders collection
                        _a.sent();
                        url = 'https://tenders.go.ke/api/TenderDisplay/OpenTenders/Open/';
                        return [4 /*yield*/, rxjs_1.firstValueFrom(this.httpService.get(url))];
                    case 2:
                        data = (_a.sent()).data;
                        filteredData = [];
                        _loop_1 = function (tender) {
                            var tenderTitle = tender.title.toLowerCase();
                            // check whether the title includes the keywords
                            var hasKeyword = filter_keywords_1.keywords.some(function (keyword) {
                                return tenderTitle.includes(keyword);
                            });
                            if (hasKeyword) {
                                filteredData.push(tender);
                            }
                        };
                        // console.log(keywords);
                        for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                            tender = data_1[_i];
                            _loop_1(tender);
                        }
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < filteredData.length)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.tenderModel.find({
                                id_tenderdetails: filteredData[i].id_tenderdetails
                            })];
                    case 4:
                        checkFromDb = _a.sent();
                        if (!(checkFromDb.length == 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.tenderModel.create(filteredData[i])];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.newTenderModel.create(filteredData[i])];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        i++;
                        return [3 /*break*/, 3];
                    case 8: return [2 /*return*/, 'Successfully updated the tender data'];
                }
            });
        });
    };
    TenderService.prototype.getNewTenders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var newTenders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.newTenderModel.find().exec()];
                    case 1:
                        newTenders = _a.sent();
                        if (newTenders.length === 0) {
                            return [2 /*return*/, 'No new tenders available'];
                        }
                        return [4 /*yield*/, this.todoService.createTodoListFromCollection()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, 'New tenders added to the collection'];
                }
            });
        });
    };
    __decorate([
        schedule_1.Cron('0 0 6 * * *') //runs every day @6am
    ], TenderService.prototype, "getTenders");
    __decorate([
        schedule_1.Cron('0 15 6 * * *') //everyday @6:15am
    ], TenderService.prototype, "getNewTenders");
    TenderService = __decorate([
        common_1.Injectable(),
        __param(0, mongoose_1.InjectModel(tender_schema_1.Tender.name)),
        __param(1, mongoose_1.InjectModel('newTenders'))
    ], TenderService);
    return TenderService;
}());
exports.TenderService = TenderService;
