import express from 'express'
const router = express.Router()
import users from '../controllers/users.js'
import { userField } from '../middleware/checkFields.js'

router.route('/').get(users.getUsers).post(userField, users.addUser)
router.route('/:id').get(users.getUser).put(userField, users.editUser).delete(users.deleteUser)

export default router
