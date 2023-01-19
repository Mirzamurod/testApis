import express from 'express'
const router = express.Router()
import albums from '../controllers/albums.js'
import { albumField } from '../middleware/checkFields.js'

router.route('/').get(albums.getAlbums).post(albumField, albums.addAlbum)
router
    .route('/:id')
    .get(albums.getAlbum)
    .put(albumField, albums.editAlbum)
    .delete(albums.deleteAlbum)

export default router
