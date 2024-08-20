const path = require('path');
const fs = require('fs');
const config = require('../config');
const Product = require('./model');
const Category = require('../category/model');
const Tag = require('../tag/model');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Metode untuk menyimpan produk baru
const store = async (req, res, next) => {
    try {
        let payload = req.body;

        // Cek dan ubah kategori jika ada
        if (payload.category) {
            let category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });
            if (category) {
                payload = { ...payload, category: category._id };
            } else {
                delete payload.category;
            }
        }

        // Cek dan ubah tags jika ada
        if (payload.tags && payload.tags.length > 0) {
            let tags = await Tag.find({ name: { $in: payload.tags } });
            if (tags.length) {
                payload = { ...payload, tags: tags.map(tag => tag._id) };
            } else {
                delete payload.tags;
            }
        }

        // Jika ada file yang diupload, proses file tersebut
        if (req.file) {
            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.').pop();
            let filename = `${req.file.filename}.${originalExt}`;
            let rootPath = config.rootPath;

            if (!rootPath) {
                throw new Error('Config rootPath is not defined');
            }

            let target_path = path.resolve(rootPath, `public/images/products/${filename}`);

            console.log('Target Path:', target_path);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {
                    let product = new Product({ ...payload, image_url: filename });
                    await product.save();
                    return res.json(product);
                } catch (err) {
                    fs.unlinkSync(target_path);
                    if (err.name === 'ValidationError') {
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        });
                    }
                    next(err);
                }
            });

            src.on('error', (err) => {
                fs.unlinkSync(target_path);
                next(err);
            });
        } else {
            let product = new Product(payload);
            await product.save();
            return res.json(product);
        }
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
};

// Metode untuk mengupdate produk
const update = async (req, res, next) => {
    try {
        let payload = req.body;
        let { id } = req.params;

        // Cek dan ubah kategori jika ada
        if (payload.category) {
            let category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });
            if (category) {
                payload = { ...payload, category: category._id };
            } else {
                delete payload.category;
            }
        }

        // Cek dan ubah tags jika ada
        if (payload.tags && payload.tags.length > 0) {
            let tags = await Tag.find({ name: { $in: payload.tags } });
            if (tags.length) {
                payload = { ...payload, tags: tags.map(tag => tag._id) };
            } else {
                delete payload.tags;
            }
        }

        // Jika ada file yang diupload, proses file tersebut
        if (req.file) {
            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.').pop();
            let filename = `${req.file.filename}.${originalExt}`;
            let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {
                    let product = await Product.findById(id);
                    if (product && product.image_url) {
                        let currentImage = path.resolve(config.rootPath, `public/images/products/${product.image_url}`);
                        if (fs.existsSync(currentImage)) {
                            fs.unlinkSync(currentImage);
                        }
                    }

                    product = await Product.findByIdAndUpdate(id, { ...payload, image_url: filename }, {
                        new: true,
                        runValidators: true
                    });
                    return res.json(product);
                } catch (err) {
                    fs.unlinkSync(target_path); // Hapus file jika ada error
                    if (err.name === 'ValidationError') {
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        });
                    }
                    next(err);
                }
            });

            src.on('error', (err) => {
                fs.unlinkSync(target_path); // Hapus file jika ada error
                next(err);
            });
        } else {
            let product = await Product.findByIdAndUpdate(id, payload, {
                new: true,
                runValidators: true
            });
            return res.json(product);
        }
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
};

// Metode untuk mengambil daftar produk dengan pagination dan filter
const index = async (req, res, next) => {
    try {
        let { skip = 0, limit = 10, q = '', category = '', tags = [] } = req.query;
        let criteria = {};
        
        if (q.length) {
            criteria = {
                ...criteria,
                name: { $regex: `${q}`, $options: 'i' } // Menggunakan regex untuk pencarian case-insensitive
            };
        }

        if (category.length) {
            let categoryResult = await Category.findOne({ name: { $regex: `${category}`, $options: 'i' } });
            if (categoryResult) {
                criteria = { ...criteria, category: categoryResult._id };
            }
        }

        if (tags.length) {
            let tagsResult = await Tag.find({ name: { $in: tags } });
            if (tagsResult.length > 0) {
                criteria = { ...criteria, tags: { $in: tagsResult.map(tag => tag._id) } };
            }
        }

        let count = await Product.find().countDocuments(); // Menambahkan hitungan total dokumen

        console.log(criteria);
        let products = await Product
            .find(criteria)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate('category')
            .populate('tags');
        return res.json({
            data: products, // Menggunakan 'products' yang telah difilter
            count // Menambahkan total hitungan dokumen dalam respons
        });
    } catch (err) {
        next(err);
    }
};

// Metode untuk menghapus produk
const destroy = async (req, res, next) => {
    try {
        let product = await Product.findByIdAndDelete(req.params.id);
        if (product && product.image_url) {
            let currentImage = path.resolve(config.rootPath, `public/images/products/${product.image_url}`);
            if (fs.existsSync(currentImage)) {
                fs.unlinkSync(currentImage);
            }
        }
        return res.json(product);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    store,
    index,
    update,
    destroy
};
