import mongoose from 'mongoose'

const CommentsSchema = mongoose.Schema(
    {
        postId: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        body: { type: String, required: true },
    },
    {
        timestamps: false,
    }
)

const Comments = mongoose.model('Comments', CommentsSchema)

export default Comments
