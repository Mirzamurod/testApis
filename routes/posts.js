import express from 'express'
const router = express.Router()
import posts from '../controllers/posts.js'
import { postField } from '../middleware/checkFields.js'

router.route('/').get(posts.getPosts).post(postField, posts.addPost)
router.route('/:id').get(posts.getPost).put(postField, posts.editPost).delete(posts.deletePost)

export default router
