const User = require('../user/model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require('../../utils');

const register = async (req, res, next) => {
    try {
        const payload = req.body;
        let user = new User(payload);
        await user.save();
        return res.json(user);
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

const localStrategy = async (email, password, done) => {
   try {
       // Gunakan model User untuk mencari pengguna
       let user = await User.findOne({ email })
           .select('-__v -createdAt -updatedAt -cart_items -token'); // Perbaiki field yang di-exclude
       
       if (!user) return done(null, false); // Tidak ada pengguna ditemukan
       
       // Verifikasi password
       if (bcrypt.compareSync(password, user.password)) {
           const { password, ...userWithoutPassword } = user.toJSON();
           return done(null, userWithoutPassword); // Kredensial valid
       } else {
           return done(null, false); // Password tidak valid
       }
   } catch (err) {
       done(err); // Tangani kesalahan
   }
}

const login = (req, res, next) => {
    passport.authenticate('local', async function (err, user) {
        if (err) return next(err);

        if (!user) return res.status(401).json({ error: 1, message: 'Email or Password incorrect' });

        try {
            // Buat payload untuk JWT dengan informasi yang relevan
            let signed = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role,
                    customer_id: user.customer_id
                },
                config.secretkey
            );

            // Update token pengguna dalam database
            await User.findByIdAndUpdate(user._id, { $push: { token: signed } });

            res.json({
                message: 'Login successful',
                user,
                token: signed
            });
        } catch (err) {
            next(err); // Tangani kesalahan
        }
    })(req, res, next);
}

const logout = async (req, res, next) => {
    let token = getToken(req);

    let user = await User.findOneAndUpdate({token: {$in: [token]}}, {$pull: {token:token}}, {useFindAndModify: false} )

    if(!token || !user) {
        res.json({
            error: 1,
            message: 'User not found...'
        });
    }

    return res.json({
        error: 0,
        message: 'Logout Berhasil'
    });
}

const me = (req, res, next) => {
    if(!req.user){
        res.json({
            err:1,
            message: 'Youre not login or token expired'
        })
    }

    res.json(req.user);
}

module.exports = {
    register,
    localStrategy,
    login,
    logout,
    me
}
