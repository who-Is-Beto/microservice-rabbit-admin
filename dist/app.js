"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const typeorm_1 = require("typeorm");
const dataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "youtube",
    entities: ["src/entities/**/*.ts"],
    logging: true,
    synchronize: true
});
dataSource
    .initialize()
    .then((db) => {
    const app = express();
    app.use(cors({
        origin: ["http://localhost:3000", "http://localhost:3001"]
    }));
    app.use(express.json());
    app.listen(8080, () => {
        console.log("Server is running on port 8080");
    });
})
    .catch((error) => {
    console.error(error);
});
//# sourceMappingURL=app.js.map