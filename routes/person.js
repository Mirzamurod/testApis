import express from 'express'
import person from '../controllers/person.js'
import { protect } from '../middleware/authMiddleware.js'
import checkFields from '../middleware/checkFields.js'

const router = express.Router()

router
    .route('/')
    .get(protect, person.getPerson)
    .post(checkFields(['email', 'password']), person.loginPerson)
    .put(checkFields(['username', 'email', 'password', 'newPassword']), protect, person.editPerson)
    .delete(protect, person.deletePerson)
router.post('/register', checkFields(['username', 'email', 'password']), person.registerPerson)

export default router
