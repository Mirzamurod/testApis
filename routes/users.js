import express from 'express'
const router = express.Router()
import users from '../controllers/users.js'
import checkFields from '../middleware/checkFields.js'

router
    .route('/')
    .get(users.getUsers)
    .post(
        checkFields([
            'name',
            'username',
            'email',
            'phone',
            // 'website',
            // 'address.street',
            // 'address.suite',
            'address.city',
            // 'address.zipcode',
        ]),
        users.addUser
    )
router
    .route('/:id')
    .get(users.getUser)
    .put(
        checkFields([
            'name',
            'username',
            'email',
            'phone',
            // 'website',
            // 'address.street',
            // 'address.suite',
            'address.city',
            // 'address.zipcode',
        ]),
        users.editUser
    )
    .delete(users.deleteUser)

export default router
