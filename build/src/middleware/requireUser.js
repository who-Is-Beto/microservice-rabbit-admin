"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUser = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const requireUser = (_, res, next) => {
    try {
        const user = res.locals.user;
        if (!user) {
            return next(new appError_1.default(401, "You must be logged in to access this route."));
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.requireUser = requireUser;
