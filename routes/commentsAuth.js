import express from 'express'
import comments from '../controllers/comments.js'
import { protect } from '../middleware/authMiddleware.js'
import checkFields from '../middleware/checkFields.js'
const router = express.Router()

router
    .route('/')
    .get(protect, comments.getComments)
    .post(protect, checkFields(['postId', 'name', 'email', 'body']), comments.addComment)
router
    .route('/:id')
    .get(protect, comments.getComment)
    .put(protect, checkFields(['postId', 'name', 'email', 'body']), comments.editComment)
    .delete(protect, comments.deleteComment)

export default router
