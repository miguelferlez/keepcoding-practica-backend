import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: String,
    owner: { ref: 'User', type: Schema.Types.ObjectId, index: true },
    price: { type: Number, min: 0 },
    image: String,
    tags: [String]
}, {
    collection: 'products'
});

const Product = model('Product', productSchema);

export default Product;