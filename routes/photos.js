import express from 'express'
import multer from 'multer'
import path from 'path'
const router = express.Router()
import photos from '../controllers/photos.js'
import { photoField } from '../middleware/checkFields.js'

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, 'images/'),
//     filename: (req, file, cb) => {
//         console.log(file)
//         cb(null, Date.now() + path.extname(file.originalname))
//     },
// })

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb(null, 'Images only!')
    }
}

// const upload = multer({
//     storage,
// })

const storage = multer.memoryStorage()
const upload = multer({ storage, fileFilter: (req, file, cb) => checkFileType(file, cb) })

router.route('/').get(photos.getPhotos).post(upload.single('image'), photoField, photos.addPhoto)
router
    .route('/:id')
    .get(photos.getPhoto)
    .put(upload.single('image'), photoField, photos.editPhoto)
    .delete(photos.deletePhoto)

export default router
