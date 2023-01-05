import mongoose from 'mongoose'

const PersonSchema = mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
)

const Person = mongoose.model('Person', PersonSchema)

export default Person
