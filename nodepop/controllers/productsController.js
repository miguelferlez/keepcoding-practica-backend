import Product from "../models/Product.js";

export function index(req, res, next) {
    res.locals.error = '';
    res.locals.name = '';
    res.locals.price = '';
    res.locals.checkedTags = [];
    res.render('new-product');
}

export async function addProduct(req, res, next) {
    try {
        const { name, price, image, tags } = req.body;
        const userId = req.session.userId;
        const product = new Product({ name, owner: userId, price, image, tags });

        if (price < 1) {
            res.locals.error = 'Price value must be minimum of 1.00$.';
            res.locals.name = name;
            res.locals.price = '';
            res.locals.checkedTags = tags ? tags : [];
            res.render('new-product');
            return;
        } else if (!tags) {
            res.locals.error = 'At least one tag must be checked.';
            res.locals.name = name;
            res.locals.price = price;
            res.locals.checkedTags = [];
            res.render('new-product');
            return;
        }

        await product.save();

        res.redirect('/');

    } catch (err) {
        next(err)
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const userId = req.session.userId;
        const productId = req.params.productId;

        await Product.deleteOne({ _id: productId, owner: userId });

        res.redirect('/');
        
    } catch (err) {
        next(err)
    }
}