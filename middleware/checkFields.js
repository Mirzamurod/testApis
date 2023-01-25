import { check } from 'express-validator'

const errorFormatter = ({ msg, param }) => {
    return { msg, param }
}

const albumField = [check('userId').notEmpty(), check('title').notEmpty()]

const commentField = [
    check(['postId', 'name', 'body']).notEmpty().withMessage('This field is required'),
    check('email')
        .notEmpty()
        .withMessage('This field is required')
        .bail()
        .isEmail()
        .withMessage('This is not Email'),
]

const personFieldPost = [
    check('email')
        .notEmpty()
        .withMessage('This field is required')
        .bail()
        .isEmail()
        .withMessage('This is not Email')
        .bail(),
    check('password')
        .notEmpty()
        .withMessage('This field is required')
        .bail()
        .isLength({ min: 5, max: 16 })
        .withMessage("Kamida 5ta ko'pida 16ta belgi bo'lishi shart"),
]

const personFieldPut = [
    check('username').notEmpty().withMessage('This field is required'),
    check('email')
        .notEmpty()
        .withMessage('This field is required')
        .bail()
        .isEmail()
        .withMessage('This is not Email'),
    check('password')
        .notEmpty()
        .withMessage('This field is required')
        .bail()
        .isLength({ min: 5, max: 16 }),
    check('newPassword')
        .notEmpty()
        .withMessage('This field is required')
        .bail()
        .isLength({ min: 5, max: 16 })
        .withMessage("Kamida 5ta ko'pida 16ta belgi bo'lishi shart")
        .bail()
        .exists()
        .custom((value, { req }) => {
            if (req.body.password && value !== req.body.password)
                throw new Error('Bu passwordga teng emas')
            else return true
        }),
]

const personFieldRegister = [
    check('username').notEmpty().withMessage('This field is required'),
    check('email')
        .notEmpty()
        .withMessage('This field is required')
        .bail()
        .isEmail()
        .withMessage('This is not Email'),
    check('password')
        .notEmpty()
        .withMessage('This field is required')
        .bail()
        .isLength({ min: 5, max: 16 })
        .bail(),
]

const photoField = [check(['albumId', 'title']).notEmpty().withMessage('This field is required')]

const postField = [
    check(['userId', 'title', 'body']).notEmpty().withMessage('This field is required'),
]

const todoField = [
    check(['userId', 'title', 'completed']).notEmpty().withMessage('This field is required'),
]

const userField = [
    check(['name', 'username', 'phone', 'address.city'])
        .notEmpty()
        .withMessage('This field is required'),
    check('email')
        .notEmpty()
        .withMessage('This field is required')
        .bail()
        .isEmail()
        .withMessage('This is not Email')
        .bail(),
]

export {
    albumField,
    commentField,
    personFieldPost,
    personFieldPut,
    personFieldRegister,
    photoField,
    postField,
    todoField,
    userField,
    errorFormatter,
}
