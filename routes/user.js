const {Router} = require('express')
const { check } = require('express-validator')
const { getUsers, putUser, postUser, deleteUser } = require('../controllers/user')
const { validateRole, existsEmail, existsUserId } = require('../helpers/db-validators')

const { validarCampos, validarJWT, isAdminRole, haveRole } = require('../middlewares')

const router = Router()

router.get('/', getUsers)

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existsUserId),
    validarCampos
], putUser)

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', "La contraseña debe tener más de 6 caracteres").isLength({min: 6}),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom(existsEmail),
    check('role').custom(validateRole),
    validarCampos
], postUser)

router.delete('/:id', [
    validarJWT,
    isAdminRole,
    haveRole('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existsUserId),
    validarCampos
], deleteUser)


module.exports = router