const { request, response } = require("express");
const { uploadFileHelper } = require('../helpers');
const { Usuario, Product } = require("../models");
const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)


const uploadFile = async (req = request, res = response) => {
    

    try {
        const fileName = await uploadFileHelper(req.files, undefined)

        res.json({
            name: fileName
        })
    } catch(err) {
        res.status(400).json({
            msg: err
        })
    }
   
}

// Fines ilustrativos
const updateImage = async (req = request, res = response) => {
    const { collection, id } = req.params

    let model;

    switch (collection) {
        case 'usuarios':
            model = await Usuario.findById(id)
            if(!model) { 
                return res.status(400).json({
                    msg: `User does not exists`
                })
            }
            break;
        case 'products':
            model = await Product.findById(id)
            if(!model){
                return res.status(400).json({
                    msg: `Product does not exists`
                })
            }
            break;
        default:
            return res.status(500).json({msg: 'Ooops!'})
    }

    // Clean prev images
    if (model.image) {
        const pathImage = path.join(__dirname, '../uploads', collection, model.image)
        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage)
        }
    }

    const fileName = await uploadFileHelper(req.files, undefined, collection)
    model.image = fileName

    try {
        await model.save()
    } catch (e) {
        return res.json({
            e
        })
    } 
    res.json(model)
}

const showImage = async (req = request, res = response) => {
    const { collection, id } = req.params

    let model;

    switch (collection) {
        case 'usuarios':
            model = await Usuario.findById(id)
            if(!model) { 
                return res.status(400).json({
                    msg: `User does not exists`
                })
            }
            break;
        case 'products':
            model = await Product.findById(id)
            if(!model){
                return res.status(400).json({
                    msg: `Product does not exists`
                })
            }
            break;
        default:
            return res.status(500).json({msg: 'Ooops!'})
    }

    // Clean prev images
    if (model.image) {
        const pathImage = path.join(__dirname, '../uploads', collection, model.image)
        if (fs.existsSync(pathImage)) {
            return res.sendFile(pathImage)
        }
    }

    const pathImage = path.join(__dirname, '../uploads', '../assets/no-image.jpg')
    res.sendFile(pathImage)

}

const updateImageCloudinary = async (req = request, res = response) => {
    const { collection, id } = req.params

    let model;

    switch (collection) {
        case 'usuarios':
            model = await Usuario.findById(id)
            if(!model) { 
                return res.status(400).json({
                    msg: `User does not exists`
                })
            }
            break;
        case 'products':
            model = await Product.findById(id)
            if(!model){
                return res.status(400).json({
                    msg: `Product does not exists`
                })
            }
            break;
        default:
            return res.status(500).json({msg: 'Ooops!'})
    }

    // Clean prev images
    if (model.image) {
        const fileNameArray = model.image.split('/')
        const fileName = fileNameArray[fileNameArray.length - 1]
        const [public_id] = fileName.split('.')
        cloudinary.uploader.destroy(public_id)
    }

    const { tempFilePath } = req.files.file
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

    model.image = secure_url

    await model.save()

    res.json(model)
}

module.exports = {
    uploadFile,
    updateImage,
    showImage,
    updateImageCloudinary
}