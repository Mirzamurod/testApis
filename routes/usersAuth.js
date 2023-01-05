import express from 'express'
import users from '../controllers/users.js'
import { protect } from '../middleware/authMiddleware.js'
import checkFields from '../middleware/checkFields.js'
const router = express.Router()

router
    .route('/')
    .get(protect, users.getUsers)
    .post(
        protect,
        checkFields(['name', 'username', 'email', 'phone', 'address.city']),
        users.addUser
    )
router
    .route('/:id')
    .get(protect, users.getUser)
    .put(
        protect,
        checkFields(['name', 'username', 'email', 'phone', 'address.city']),
        users.editUser
    )
    .delete(protect, users.deleteUser)

export default router
