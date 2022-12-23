import expressAsyncHandler from 'express-async-handler'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'
import Photos from '../models/Photos.js'
import Albums from './../models/Albums.js'

const photos = {
    /**
     * @desc    Fetch all Photos
     * @route   GET /Photos
     * @access  Public
     */
    getPhotos: expressAsyncHandler(async (req, res) => {
        const photos = await Photos.find({})
        res.status(200).json(photos)
    }),

    /**
     * @desc    Get photo
     * @route   GET /Photos/:id
     * @access  Public
     */
    getPhoto: expressAsyncHandler(async (req, res) => {
        const photo = await Photos.findById(req.params.id)

        if (photo) res.status(200).json(photo)
        else res.status(400).json({ message: 'Photo not found' })
    }),

    /**
     * @desc    Add photo
     * @route   POST /Photos
     * @access  Public
     */
    addPhoto: expressAsyncHandler(async (req, res) => {
        const { albumId, title } = req.body

        if (req.file) {
            const album = await Albums.findById(albumId)
            const check1 = req.file.originalname.includes('.jpg')
            const check2 = req.file.originalname.includes('.jpeg')
            const check3 = req.file.originalname.includes('.png')

            if (album) {
                if (check1 || check2 || check3) {
                    const imageName = Date.now() + path.extname(req.file.originalname)
                    const image600 = await sharp(req.file.buffer)
                        .resize({ width: 600, height: 600 })
                        .toFormat('png')
                        .toFile('./images/' + 600 + imageName)
                    const image150 = await sharp(req.file.buffer)
                        .resize({ width: 150, height: 150 })
                        .toFormat('png')
                        .toFile('./images/' + 150 + imageName)

                    if (image600 && image150) {
                        const addedPhoto = await Photos.create({
                            albumId,
                            title,
                            url: `${process.env.IMAGE_URL}600${imageName}`,
                            thumbnailUrl: `${process.env.IMAGE_URL}150${imageName}`,
                        })

                        if (addedPhoto) {
                            res.status(201).json({ message: 'Photo added', success: true })
                        } else
                            res.status(400).json({ message: 'Invalid photo data', success: false })
                    }
                } else
                    res.status(400).json({
                        message: { image: `${req.file.originalname} is not image` },
                        success: false,
                    })
            } else res.status(400).json({ message: 'Album not found', success: false })
        } else
            res.status(400).json({ message: { image: 'This field is required' }, success: false })
    }),

    /**
     * @desc    Edit photo
     * @route   PUT /Photos/:id
     * @access  Public
     */
    editPhoto: expressAsyncHandler(async (req, res) => {
        const photo = await Photos.findById(req.params.id)

        if (photo) {
            if (req.file) {
                const { albumId, title } = req.body
                const album = await Albums.findById(albumId)
                const check1 = req.file.originalname.includes('.jpg')
                const check2 = req.file.originalname.includes('.jpeg')
                const check3 = req.file.originalname.includes('.png')

                if (album) {
                    if (check1 || check2 || check3) {
                        const imageName = Date.now() + path.extname(req.file.originalname)
                        const image600 = await sharp(req.file.buffer)
                            .resize({ width: 600, height: 600 })
                            .toFormat('png')
                            .toFile('./images/' + 600 + imageName)
                        const image150 = await sharp(req.file.buffer)
                            .resize({ width: 150, height: 150 })
                            .toFormat('png')
                            .toFile('./images/' + 150 + imageName)

                        if (image600 && image150) {
                            const updatePhoto = await Photos.findByIdAndUpdate(
                                req.params.id,
                                {
                                    albumId,
                                    title,
                                    url: `${process.env.IMAGE_URL}600${imageName}`,
                                    thumbnailUrl: `${process.env.IMAGE_URL}150${imageName}`,
                                    _id: req.params.id,
                                },
                                { new: true }
                            )

                            if (updatePhoto) {
                                const imageUrl = './images/'
                                const url = photo.url.split('/')
                                const thumbnailUrl = photo.thumbnailUrl.split('/')
                                fs.unlink(imageUrl + url[url.length - 1])
                                fs.unlink(imageUrl + thumbnailUrl[thumbnailUrl.length - 1])
                                res.status(200).json({ message: 'Photo updated', success: true })
                            } else
                                res.status(400).json({
                                    message: 'Invalid photo data',
                                    success: false,
                                })
                        }
                    } else
                        res.status(400).json({
                            message: { image: `${req.file.originalname} is not image` },
                            success: false,
                        })
                } else res.status(400).json({ message: 'Album not found', success: false })
            } else
                res.status(400).json({
                    message: { image: 'This field is required' },
                    success: false,
                })
        } else res.status(400).json({ message: 'Photo not found', success: false })
    }),

    /**
     * @desc    Delete photo
     * @route   DELETE /Photos/:id
     * @access  Public
     */
    deletePhoto: expressAsyncHandler(async (req, res) => {
        const photo = await Photos.findById(req.params.id)

        if (photo) {
            const imageUrl = './images/'
            const url = photo.url.split('/')
            const thumbnailUrl = photo.thumbnailUrl.split('/')
            fs.unlink(imageUrl + url[url.length - 1])
            fs.unlink(imageUrl + thumbnailUrl[thumbnailUrl.length - 1])
            await Photos.findByIdAndDelete(req.params.id)

            res.status(200).json({ message: 'Photo deleted', success: true })
        } else res.status(400).json({ message: 'Photo not found', success: false })
    }),
}

export default photos
