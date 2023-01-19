import express from 'express'
const router = express.Router()
import comments from '../controllers/comments.js'
import { commentField } from '../middleware/checkFields.js'

router.route('/').get(comments.getComments).post(commentField, comments.addComment)
router
    .route('/:id')
    .get(comments.getComment)
    .put(commentField, comments.editComment)
    .delete(comments.deleteComment)

export default router
