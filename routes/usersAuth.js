import express from 'express'
import users from '../controllers/users.js'
import { protect } from '../middleware/authMiddleware.js'
import { userField } from '../middleware/checkFields.js'
const router = express.Router()

router.route('/').get(protect, users.getUsers).post(protect, userField, users.addUser)
router
    .route('/:id')
    .get(protect, users.getUser)
    .put(protect, userField, users.editUser)
    .delete(protect, users.deleteUser)

export default router
