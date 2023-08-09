"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.Admin = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
    purchasedProducts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product' }]
});
const adminSchema = new mongoose_1.default.Schema({
    username: String,
    password: String
});
const productSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    inStock: Boolean
});
exports.User = mongoose_1.default.model('User', userSchema);
exports.Admin = mongoose_1.default.model('Admin', adminSchema);
exports.Product = mongoose_1.default.model('Product', productSchema);
