const { police_check } = require('../../middlewares');
const deliveryAddressController = require('./controller');
const router = require('express').Router();

// Route untuk menyimpan alamat pengiriman baru
router.post(
    '/delivery-addresses',
    police_check('create', 'DeliveryAddress'),
    deliveryAddressController.store
);

// Route untuk mengambil semua alamat pengiriman
router.get(
    '/delivery-addresses',
    police_check('view', 'DeliveryAddress'),
    deliveryAddressController.index
);

// Route untuk memperbarui alamat pengiriman berdasarkan id
router.put(
    '/delivery-addresses/:id', deliveryAddressController.update
);

// Route untuk menghapus alamat pengiriman berdasarkan id
router.delete(
    '/delivery-addresses/:id',
    deliveryAddressController.destroy
);

module.exports = router;
