"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secret = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
exports.secret = process.env.SECRET_KEY;
const admin_1 = __importDefault(require("./routes/admin"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
const port = 5000;
const MONGO_DB = process.env.MONGO_DB;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({ "Message": "welcome to my server at port 5000!" });
});
app.use("/admin", admin_1.default);
app.use("/user", user_1.default);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
mongoose_1.default.connect(MONGO_DB, { dbName: "courses" });
