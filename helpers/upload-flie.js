const path = require('path')
const { v4: uuidv4 } = require('uuid')

const uploadFileHelper = (files, validExtensions = ['png', 'jpg', 'jpeg'], folder = '') => {
    return new Promise((resolve, reject) => {
        const { file } = files
        const nameList = file.name.split('.')
        const extension = nameList[nameList.length - 1]
        
        if(!validExtensions.includes(extension)) {
            return reject(`The extension ${extension} is not allowed - ${validExtensions}`)
        }
    
        const nameTemp = uuidv4() + '.' + extension
        uploadPath = path.join(__dirname, '../uploads/', folder, nameTemp)
    
        file.mv(uploadPath,  (err) =>  {
            if (err) {
                return res.status(500).json({ err })
            }
    
            resolve(nameTemp)
        })
    })
}

module.exports = {
    uploadFileHelper
}
