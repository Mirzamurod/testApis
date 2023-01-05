import express from 'express'
const router = express.Router()
import users from '../controllers/users.js'
import { protect } from '../middleware/authMiddleware.js'
import checkFields from '../middleware/checkFields.js'

router
    .route('/')
    .get(users.getUsers)
    .post(checkFields(['name', 'username', 'email', 'phone', 'address.city']), users.addUser)
router
    .route('/:id')
    .get(users.getUser)
    .put(checkFields(['name', 'username', 'email', 'phone', 'address.city']), users.editUser)
    .delete(users.deleteUser)

export default router
