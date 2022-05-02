const bcryptjs = require('bcryptjs')
const  { response, request } = require('express')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')
const Usuario = require('../models/usuario')



const login = async(req = request, res = response) => {

    const { email, password } = req.body

    try {
        // Verificar si el email existe
        const usuario = await Usuario.findOne({email})
        if(!usuario) {
            return res.status(400).json({
                msg: 'Email o password no son correctos --> correo'
            })
        }

        // Verificar si el usuario está activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Email o password no son correctos --> estado: false'
            })
        }

        // Vierificar el password
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Email o password no son correctos --> password'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id)
        
        res.json({
            usuario,
            token
        })
    }catch(error) {
        return res.status(500).json({
            msg: 'Algo salió mal',
            error
        })
    }
}

const google_signIn = async (req = request, res = response) => {
    const { id_token } = req.body

    try {
        const { email, name, picture } = await googleVerify(id_token)
        let user = await Usuario.findOne({email})
        if(!user) {
            // Create user
            const data = {
                name,
                email,
                password: '123456',
                image: picture,
                google: true,
                role: 'USER_ROLE'
            }

            user = new Usuario(data)
            await user.save()
        }

        // User in DB
        if(!user.estado) { 
            return res.status(401).json({
                msg: 'Hable con el admi, usuario bloqueado'
            })
        }

        // Generar JWT
        const token = await generarJWT(user.id )

        res.json({
            user, 
            token
        })
    } catch (error) {
        res.status(400).json({
            msg: 'El token no se pudo verificar',
            ok: false,
            error
        })
    }
}

module.exports = {
    login,
    google_signIn
}