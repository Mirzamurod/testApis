import expressAsyncHandler from 'express-async-handler'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'
import { validationResult } from 'express-validator'
import Photos from '../models/Photos.js'
import Albums from './../models/Albums.js'

const photos = {
    /**
     * @desc    Fetch all Photos
     * @route   GET /photos
     * @access  Public
     */
    getPhotos: expressAsyncHandler(async (req, res) => {
        const { limit, page, sortName, sortValue, albumId, title, customSelect } = req.query

        let arrs = {}

        if (typeof customSelect === 'object' && customSelect.length)
            customSelect.forEach(select => (arrs[select] = 1))
        else if (typeof customSelect === 'string') arrs[customSelect] = 1

        if (+limit && +page) {
            const photos = await Photos.find(
                {
                    albumId: { $regex: albumId ?? '', $options: 'i' },
                    title: { $regex: title ?? '', $options: 'i' },
                },
                arrs
            )
                .sort(sortValue ? { [sortName]: sortValue } : sortName)
                .limit(+limit)
                .skip(+limit * (+page - 1))

            const pageLists = Math.ceil(
                (
                    await Photos.find({
                        albumId: { $regex: albumId ?? '', $options: 'i' },
                        title: { $regex: title ?? '', $options: 'i' },
                    })
                ).length / limit
            )

            res.status(200).json({ data: photos, pageLists, page })
        } else {
            const photos = await Photos.find(
                {
                    albumId: { $regex: albumId ?? '', $options: 'i' },
                    title: { $regex: title ?? '', $options: 'i' },
                },
                arrs
            ).sort(sortValue ? { [sortName]: sortValue } : sortName)
            res.status(200).json(photos)
        }
    }),

    /**
     * @desc    Get photo
     * @route   GET /photos/:id
     * @access  Public
     */
    getPhoto: expressAsyncHandler(async (req, res) => {
        const { customSelect } = req.query

        let arrs = {}

        if (typeof customSelect === 'object' && customSelect.length)
            customSelect.forEach(select => (arrs[select] = 1))
        else if (typeof customSelect === 'string') arrs[customSelect] = 1

        const photo = await Photos.findById(req.params.id, arrs)

        if (photo) res.status(200).json(photo)
        else res.status(400).json({ message: 'Photo not found' })
    }),

    /**
     * @desc    Add photo
     * @route   POST /photos
     * @access  Public
     */
    addPhoto: expressAsyncHandler(async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

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
     * @route   PUT /photos/:id
     * @access  Public
     */
    editPhoto: expressAsyncHandler(async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

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
     * @route   DELETE /photos/:id
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
