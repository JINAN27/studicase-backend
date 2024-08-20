const Product = require('../product/model');
const CartItem = require('../cart-item/model');

const update = async (req, res, next) => {
    try{
        const {item} = req.body;
        const ProductIds = items.map(item => item.product._Id);
        const Products = await Product.find ({_id: {$in: ProductIds}});
        let cartItems = items.map(item =>{
            let relatedProduct = products.find(product => product._Id.toString() === item.product._Id);
            return{
                product: relatedProduct._id,
                price: relatedProduct.price,
                image_url: relatedProduct.image_url,
                name: relatedProduct.name,
                user: req.user._id,
                qty: item.qty
            }
        });

        await CartItem.deleteMany({user: req.user._id});
        await CartItem.bulkWrite(cartItems.map (item =>{
            return {
                updateOne: {
                    filter: {
                        user: req.user._id,
                        product: item.product
                    },

                    update: item,
                    upsert: true
                }
            }
        }));

        return res.json(cartItems);
    } catch (err) {
        if(err && err.name == 'ValidationError'){
            return res.json({
                errors: 1,
                messsage: err.message,
                fields: err.errors
            });
        }

        next(err);
    }
}

const index = async (req, res, next) => {
    try{
        let items =
        await CartItem.find({user: req.user._id}).populate('product');

        res.json(items);
    }catch(err){
        if(err && err.name == 'ValidationError'){
        return res.json({
            error: 1,
            messsage: err.message,
            fields: err.errors
        });
    }

    next(err)
}
}

module.exports = {
    update,
    index
}
