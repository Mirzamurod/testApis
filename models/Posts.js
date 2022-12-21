import mongoose from 'mongoose'

const PostsSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
})

const Posts = mongoose.model('Posts', PostsSchema)

export default Posts
