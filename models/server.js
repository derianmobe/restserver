const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')
const fileUpload = require('express-fileupload')

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT

        this.paths = {
            user: '/api/usuarios',
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            upload: '/api/upload'
        }

        // Conectar base de datos
        this.conectarDB()

        // Middlewares
        this.middlewares()

        // Rutas
        this.routes()
    }

    async conectarDB() {
        await dbConnection()
    }

    middlewares() {
        // CORS
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use(express.json())

        // Folder public
        this.app.use(express.static('public'))

        // File upload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }))
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.user, require('../routes/user'))
        this.app.use(this.paths.categories, require('../routes/categories'))
        this.app.use(this.paths.products, require('../routes/products'))
        this.app.use(this.paths.search, require('../routes/search'))
        this.app.use(this.paths.upload, require('../routes/uploads'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`App is listening on port ${this.port}`)
        })
    }
}

module.exports = Server