const {Router} = require('express')
const { check } = require('express-validator')
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories')
const { existsCategory } = require('../helpers/db-validators')
const { validarJWT } = require('../middlewares')
const { validarCampos } = require('../middlewares/validar-campos')

const router = Router()

// {{url}}/api/categories

// Obtener todas las categorias - publico
router.get('/', getCategories)


// Obtener una categoría por id - publico
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existsCategory),
    validarCampos
], getCategory)

// Crear categoria - privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('name','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], createCategory)

// Actualizar una categoría por id - publico - cualquier persona con token valido
router.put('/:id', [
    validarJWT,
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existsCategory),
    validarCampos
], updateCategory)

// Borrar categoría - privado - Admin (estado en false)
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existsCategory),
    validarCampos
], deleteCategory)

module.exports = router