import express from 'express'
const router = express.Router()
import posts from '../controllers/posts.js'
import checkFields from '../middleware/checkFields.js'

router
    .route('/')
    .get(posts.getPosts)
    .post(checkFields(['userId', 'title', 'body']), posts.addPost)
router
    .route('/:id')
    .get(posts.getPost)
    .put(checkFields(['userId', 'title', 'body']), posts.editPost)
    .delete(posts.deletePost)

export default router
