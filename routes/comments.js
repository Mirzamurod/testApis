import express from 'express'
const router = express.Router()
import comments from '../controllers/comments.js'
import checkFields from '../middleware/checkFields.js'

router
    .route('/')
    .get(comments.getComments)
    .post(checkFields(['postId', 'name', 'email', 'body']), comments.addComment)
router
    .route('/:id')
    .get(comments.getComment)
    .put(checkFields(['postId', 'name', 'email', 'body']), comments.editComment)
    .delete(comments.deleteComment)

export default router
