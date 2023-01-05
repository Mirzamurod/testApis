import express from 'express'
import posts from '../controllers/posts.js'
import { protect } from '../middleware/authMiddleware.js'
import checkFields from '../middleware/checkFields.js'
const router = express.Router()

router
    .route('/')
    .get(protect, posts.getPosts)
    .post(protect, checkFields(['userId', 'title', 'body']), posts.addPost)
router
    .route('/:id')
    .get(protect, posts.getPost)
    .put(protect, checkFields(['userId', 'title', 'body']), posts.editPost)
    .delete(protect, posts.deletePost)

export default router
