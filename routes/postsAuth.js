import express from 'express'
import posts from '../controllers/posts.js'
import { protect } from '../middleware/authMiddleware.js'
import { postField } from '../middleware/checkFields.js'
const router = express.Router()

router.route('/').get(protect, posts.getPosts).post(protect, postField, posts.addPost)
router
    .route('/:id')
    .get(protect, posts.getPost)
    .put(protect, postField, posts.editPost)
    .delete(protect, posts.deletePost)

export default router
