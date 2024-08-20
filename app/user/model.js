const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');

// Definisikan skema untuk model User
let userSchema = new Schema({
    full_name: {
        type: String,
        required: [true, 'Nama harus diisi'],
        maxlength: [255, 'Panjang nama harus antara 3-255 karakter'],
        minlength: [3, 'Panjang nama harus antara 3-255 karakter'], // Sudah benar
    },
    customer_id: {
        type: Number,
    },
    email: {
        type: String,
        required: [true, 'Email harus diisi'],
        maxlength: [255, 'Panjang email maksimal 255 karakter'],
    },
    password: {
        type: String,
        required: [true, 'Password harus diisi'],
        maxlength: [255, 'Panjang password maksimal 255 karakter'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    token: [String]
}, { timestamps: true }); // Sudah benar

// Validasi email
userSchema.path('email').validate(function(value) {
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
}, attr => `${attr.value} harus merupakan email yang valid!`);

userSchema.path('email').validate(async function(value) {
    try {
        const count = await this.model('User').countDocuments({ email: value });
        return !count;
    } catch (err) {
        throw err;
    }
}, attr => `${attr.value} sudah terdaftar`);

// Hash password sebelum menyimpan
const HASH_ROUND = 10;
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, HASH_ROUND); // Sudah benar
    }
    next();
});

// Tambahkan plugin AutoIncrement untuk customer_id
userSchema.plugin(AutoIncrement, { inc_field: 'customer_id' });

// Ekspor model User
module.exports = model('User', userSchema);
