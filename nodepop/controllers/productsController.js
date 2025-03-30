import Product from "../models/Product.js";
import multer from "multer";
import path from "node:path";
import fs from 'node:fs'

export function index(req, res, next) {
    res.locals.error = '';
    res.locals.name = '';
    res.locals.price = 0;
    res.locals.checkedTags = [];
    res.render('new-product');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({storage});

export async function addProduct(req, res, next) {
    try {
        const { name, price, tags } = req.body;
        const imagePath = req.file ? `./images/${req.file.filename}` : './images/placeholder.jpg';
        const userId = req.session.userId;
        const product = new Product({ name, owner: userId, price, image: imagePath, tags });

        if (price < 1) {
            res.locals.error = 'Price value must be minimum of 1.00$.';
            res.locals.name = name;
            res.locals.price = 0;
            res.locals.checkedTags = tags ? tags : [];
            const imageFile = path.join(import.meta.dirname,'../public', product.image);
            fs.unlink(imageFile, (err) => {
                if (err) {
                    cb(err);
                }
            });
            res.render('new-product')
            return;
        } else if (!tags) {
            res.locals.error = 'At least one tag must be checked to proceed.';
            res.locals.name = name;
            res.locals.price = price;
            res.checkedTags = [];
            const imageFile = path.join(import.meta.dirname,'../public', product.image);
            fs.unlink(imageFile, (err) => {
                if (err) {
                    cb(err);
                }
            });
            res.render('new-product')
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

        await deleteLocalImage(productId, next);
        await Product.deleteOne({ _id: productId, owner: userId });

        res.redirect('/');
        
    } catch (err) {
        next(err)
    }
}

async function deleteLocalImage(id, cb) {
    const product = await Product.findOne({_id: id});
    const imageFile = path.join(import.meta.dirname,'../public', product.image);
    fs.unlink(imageFile, (err) => {
        if (err) {
            cb(err);
        }
    });
}