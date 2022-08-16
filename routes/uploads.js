const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFile, updateImage, showImage, updateImageCloudinary } = require('../controllers/uploads');
const { allowedCollections } = require('../helpers');
const { validarCampos, validateFile } = require('../middlewares');

const router = Router();

router.post('/', validateFile, uploadFile)

router.put('/:collection/:id',[
    check('id', 'ID must be a Mongo ID').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['products', 'usuarios'])),
    validateFile,
    validarCampos
], updateImageCloudinary)


router.get('/:collection/:id', [ check('id', 'ID must be a Mongo ID').isMongoId(),
check('collection').custom(c => allowedCollections(c, ['products', 'usuarios'])),
validarCampos
], showImage)

module.exports = router