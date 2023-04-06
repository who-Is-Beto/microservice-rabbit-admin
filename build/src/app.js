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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const data_source_1 = require("./utils/data-source");
const connectRedis_1 = __importDefault(require("./utils/connectRedis"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const appError_1 = __importDefault(require("./utils/appError"));
data_source_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    // VALIDATE ENV
    (0, validateEnv_1.default)();
    const app = (0, express_1.default)();
    // MIDDLEWARE
    // 1. Body parser
    app.use(express_1.default.json({ limit: "10kb" }));
    // 2. Logger
    if (process.env.NODE_ENV === "development") {
        app.use((0, morgan_1.default)("dev"));
    }
    // 3. Cookie Parser
    app.use((0, cookie_parser_1.default)());
    // 4. Cors
    app.use((0, cors_1.default)({
        origin: config_1.default.get("origin"),
        credentials: true
    }));
    // ROUTES
    // HEALTH CHECKER
    app.use("api/auth", auth_routes_1.default);
    app.use("api/users", user_routes_1.default);
    app.get("/api/healthchecker", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const message = yield connectRedis_1.default.get("try");
        res.status(200).json({
            status: "success",
            message
        });
    }));
    // UNHANDLED ROUTE
    app.all("*", (req, res, next) => {
        next(new appError_1.default(404, `Route ${req.originalUrl} not found`));
    });
    // GLOBAL ERROR HANDLER
    app.use((error, req, res, next) => {
        error.status = error.status || "error";
        error.statusCode = error.statusCode || 500;
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    });
    const port = config_1.default.get("port");
    app.listen(port);
    console.log(`Server started on port: ${port}`);
}))
    .catch((error) => console.log(error));
