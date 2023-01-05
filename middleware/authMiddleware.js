import jwt from 'jsonwebtoken'
import expressAsyncHandler from 'express-async-handler'
import User from '../models/Person.js'

const protect = expressAsyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

            // Get person from the token
            req.person = await User.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            // console.log(error)
            res.status(401).json({ message: 'Not authorized' })
        }
    }

    if (!token) res.status(401).json({ message: 'Not authorized, no token' })
})

export { protect }
