import express from 'express'
import albums from '../controllers/albums.js'
import { protect } from '../middleware/authMiddleware.js'
import checkFields from '../middleware/checkFields.js'
const router = express.Router()

router
    .route('/')
    .get(protect, albums.getAlbums)
    .post(protect, checkFields(['userId', 'title']), albums.addAlbum)
router
    .route('/:id')
    .get(protect, albums.getAlbum)
    .put(protect, checkFields(['userId', 'title']), albums.editAlbum)
    .delete(protect, albums.deleteAlbum)

export default router
