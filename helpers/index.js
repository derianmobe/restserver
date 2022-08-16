const dbValidators = require('./db-validators')
const generateJWT = require('./generar-jwt')
const googleVerify = require('./google-verify')
const uploadFile = require('./upload-flie')

module.exports = {
    ...dbValidators,
    ...generateJWT,
    ...googleVerify,
    ...uploadFile
}