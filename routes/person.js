import express from 'express'
import person from '../controllers/person.js'
import { protect } from '../middleware/authMiddleware.js'
import { personFieldPost, personFieldPut, personFieldRegister } from '../middleware/checkFields.js'

const router = express.Router()

router
    .route('/')
    .get(protect, person.getPerson)
    .post(personFieldPost, person.loginPerson)
    .put(protect, personFieldPut, person.editPerson)
    .delete(protect, person.deletePerson)
router.post('/register', personFieldRegister, person.registerPerson)

export default router
