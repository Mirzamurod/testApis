import mongoose from 'mongoose'

const PhotosSchema = mongoose.Schema({
    albumId: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
})

const Photos = mongoose.model('Photos', PhotosSchema)

export default Photos
