const Product = require('../product/model');
const CartItem = require('../cart-item/model');

const update = async (req, res, next) => {
    try {
        const { items } = req.body;

        // Validasi input
        if (!Array.isArray(items)) {
            return res.status(400).json({ message: 'Invalid input: items must be an array.' });
        }

        // Ambil ID produk dari items
        const productIds = items.map(item => item.product._id);

        // Ambil produk dari database
        const products = await Product.find({ _id: { $in: productIds } });

        // Peta items untuk disimpan dalam cart
        const cartItems = items.map(item => {
            const relatedProduct = products.find(product => product._id.toString() === item.product._id.toString());

            if (!relatedProduct) {
                throw new Error(`Product with ID ${item.product._id} not found.`);
            }

            return {
                product: relatedProduct._id,
                price: relatedProduct.price,
                image_url: relatedProduct.image_url,
                name: relatedProduct.name,
                user: req.user._id,
                qty: item.qty
            };
        });

        // Hapus semua item di cart milik user
        await CartItem.deleteMany({ user: req.user._id });

        // Simpan item cart dengan upsert
        await CartItem.bulkWrite(cartItems.map(item => ({
            updateOne: {
                filter: {
                    user: req.user._id,
                    product: item.product
                },
                update: item,
                upsert: true
            }
        })));

        return res.json(cartItems);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                errors: 1,
                message: err.message,
                fields: err.errors
            });
        }

        // Kirim kesalahan server
        next(err);
    }
}

const index = async (req, res, next) => {
    try {
        const items = await CartItem.find({ user: req.user._id }).populate('product');
        res.json(items);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }

        next(err);
    }
}

module.exports = {
    update,
    index
}
