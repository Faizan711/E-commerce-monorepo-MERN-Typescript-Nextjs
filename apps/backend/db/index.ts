import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedProducts : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});


const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    inStock: Boolean
})

export const User = mongoose.model('User', userSchema);
export const Admin = mongoose.model('Admin', adminSchema);
export const Product = mongoose.model('Product', productSchema);
