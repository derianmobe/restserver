const {Router} = require('express')
const { check } = require('express-validator')
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/products')
const { existsCategory, existsProduct } = require('../helpers/db-validators')
const { validarJWT, validarCampos } = require('../middlewares')



const router = Router()

// {{url}}/api/products

// Obtener todos los productos - publico
router.get('/', getProducts)

// Obtener un producto por id - publico
router.get('/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(existsProduct),
    validarCampos
], getProduct)

// Crear categoría - privado - token valido
router.post('/', [
    validarJWT,
    check('name','Name must be required').not().isEmpty(),
    check('category','Is not a Mongo ID').isMongoId(),
    check('category').custom(existsCategory),
    validarCampos
], createProduct)

// Actualizar categoría por id - privado - persona con token
router.put('/:id', [
    validarJWT,
    check('name', 'Name must be required').not().isEmpty(),
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(existsProduct),
    validarCampos
], updateProduct)

// Borrar producto - privado - Admin
router.delete('/:id', [
    validarJWT,
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(existsProduct),
    validarCampos
], deleteProduct)

module.exports = router
