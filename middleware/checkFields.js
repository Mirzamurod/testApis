import expressAsyncHandler from 'express-async-handler'

const checkFields = fields1 =>
    expressAsyncHandler((req, res, next) => {
        let fields = {}
        fields1.forEach(field => {
            const arr = field.split('.')
            if (arr.length === 1) fields[field] = req.body[field]
            else if (arr.length === 2) {
                arr.forEach((item, index) => {
                    if (index) {
                        fields[arr[index - 1]] = { ...fields[arr[index - 1]] }
                        fields[arr[index - 1]][item] = req.body?.[arr[index - 1]]?.[item]
                    }
                })
            }
        })

        // Check if empty field
        const messageText = 'This field is required!'
        let message = {}
        Object.keys(fields).forEach(field => {
            if (typeof fields[field] !== 'object' && !fields[field]) message[field] = messageText
            else if (typeof fields[field] === 'object') {
                Object.keys(fields[field]).forEach(field1 => {
                    if (typeof fields[field][field1] !== 'object' && !fields[field][field1]) {
                        message[field] = { ...(message[field] ?? {}) }
                        message[field][field1] = messageText
                    }
                })
            }
        })

        if (Object.keys(message).length) res.status(400).json({ message, success: false })
        else next()
    })

export default checkFields
