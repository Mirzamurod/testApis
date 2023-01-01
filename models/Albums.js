import mongoose from 'mongoose'

const AlbumsSchema = mongoose.Schema(
    {
        userId: { type: String, required: true },
        title: { type: String, required: true },
    },
    { timestamps: true }
)

const Albums = mongoose.model('Albums', AlbumsSchema)

export default Albums
