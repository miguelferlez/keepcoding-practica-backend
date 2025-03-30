import Product from '../models/Product.js';
import User from '../models/User.js';

export async function index(req, res, next){
    try {
        const userId = req.session.userId;

        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const skip = (page - 1) * limit;

        res.locals.products = await Product.find({ owner: userId }).skip(skip).limit(limit);
        const totalProducts = await Product.find({ owner: userId }).countDocuments();

        for (let product of res.locals.products) {
            const ownerId = product.owner.toString();
            const user = await User.findOne({_id: ownerId});
            product.username = user.name
        }

        res.locals.currentPage = page;
        res.locals.totalPages = Math.ceil(totalProducts / limit);

        res.render('home');
    } catch (err) {
        next(err);
    }
}