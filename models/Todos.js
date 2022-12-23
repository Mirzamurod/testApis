import mongoose from 'mongoose'

const TodosSchema = mongoose.Schema(
    {
        userId: { type: String, required: true },
        title: { type: String, required: true },
        completed: { type: Boolean, required: true },
    },
    {
        timestamps: false,
    }
)

const Todos = mongoose.model('Todos', TodosSchema)

export default Todos
