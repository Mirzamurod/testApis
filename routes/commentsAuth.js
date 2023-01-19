import express from 'express'
import comments from '../controllers/comments.js'
import { protect } from '../middleware/authMiddleware.js'
import { commentField } from '../middleware/checkFields.js'
const router = express.Router()

router
    .route('/')
    .get(protect, comments.getComments)
    .post(protect, commentField, comments.addComment)
router
    .route('/:id')
    .get(protect, comments.getComment)
    .put(protect, commentField, comments.editComment)
    .delete(protect, comments.deleteComment)

export default router
