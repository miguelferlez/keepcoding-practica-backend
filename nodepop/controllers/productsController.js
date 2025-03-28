import Product from "../models/Product.js";

export function index(req, res, next) {
    res.render('new-product');
}

export async function addProduct(req, res, next) {
    try {
        const { name, price, image, tags } = req.body;
        const product = new Product({ name, owner, price, image, tags });

        await product.save();

        res.redirect('/');

    } catch (err) {
        next(err)
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const userId = req.session.userId;
        const productId = req.session.productId;

        await Product.deleteOne({ _id: productId, owner: userId });

        res.redirect('/');
        
    } catch (err) {
        next(err)
    }
}