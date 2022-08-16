const  validarCampos  = require('../middlewares/validar-campos')
const  validarJWT  = require('../middlewares/validar-jwt')
const  validarRoles = require('../middlewares/validar-role')
const validateFile = require('../middlewares/validate-file')


module.exports = {
    ...validarCampos, 
    ...validarJWT,
    ...validarRoles,
    ...validateFile
}