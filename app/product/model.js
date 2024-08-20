const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const productSchema = Schema({
    name: {
        type: String,
        minlength: [3, 'Panjang nama minimal 3 karakter'],
        required: [true, 'Nama harus diisi']
    },
    description: {
        type: String,
        maxlength: [1000, 'Panjang deskripsi maksimal 1000 karakter']
    },
    price: {
        type: Number,
        default: 0,
    },
    image_url: String,

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },

    tags: {
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }



}, { timestamps: true });  // Menggunakan 'timestamps' dengan 's' kecil

module.exports = model('Product', productSchema);
