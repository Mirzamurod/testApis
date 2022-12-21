import express from 'express'
import multer from 'multer'
import path from 'path'
const router = express.Router()
import photos from '../controllers/photos.js'
import checkFields from '../middleware/checkFields.js'

const storage = multer.diskStorage({
    destination: (req, file, cb) => cd(null, 'images'),
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    },
})

const upload = multer({ storage })

router
    .route('/')
    .get(photos.getPhotos)
    .post(upload.array(''), checkFields(['albumId', 'title']), photos.addPhoto)
router.route('/:id').get(photos.getPhoto)

export default router
