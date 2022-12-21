import express from 'express'
const router = express.Router()
import albums from '../controllers/albums.js'
import checkFields from '../middleware/checkFields.js'

router
    .route('/')
    .get(albums.getAlbums)
    .post(checkFields(['userId', 'title']), albums.addAlbum)
router
    .route('/:id')
    .get(albums.getAlbum)
    .put(checkFields(['userId', 'title']), albums.editAlbum)
    .delete(albums.deleteAlbum)

export default router
