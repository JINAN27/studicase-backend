const mongoose = require('mongoose');
const {model, Schema} = mongoose;

let categorySchema = Schema ({
    name : {
        type: 'string',
        minlength: [3, 'Panjang nama kategori minimal 3 karakter'],
        maxlength: [20, 'panjang nama kategori maksimal 20 karakter'],
        required:  [true, 'Nama kategori harus di isi']
    }
})

module.exports = model('Category', categorySchema);