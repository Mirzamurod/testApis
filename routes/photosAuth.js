import express from 'express'
import multer from 'multer'
import path from 'path'
import photos from '../controllers/photos.js'
import { protect } from '../middleware/authMiddleware.js'
import checkFields from '../middleware/checkFields.js'
const router = express.Router()

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

router
    .route('/')
    .get(protect, photos.getPhotos)
    .post(protect, upload.single('image'), checkFields(['albumId', 'title']), photos.addPhoto)
router
    .route('/:id')
    .get(protect, photos.getPhoto)
    .put(protect, upload.single('image'), checkFields(['albumId', 'title']), photos.editPhoto)
    .delete(protect, photos.deletePhoto)

export default router
