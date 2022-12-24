import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import colors from 'colors'
import connectDb from './config/db.js'

// routes
import albums from './routes/albums.js'
import comments from './routes/comments.js'
import photos from './routes/photos.js'
import posts from './routes/posts.js'
import todos from './routes/todos.js'
import users from './routes/users.js'

// Models
import Albums from './models/Albums.js'
import Comments from './models/Comments.js'
import Photos from './models/Photos.js'
import Posts from './models/Posts.js'
import Todos from './models/Todos.js'
import Users from './models/Users.js'

// data
import albumsData from './data/albums.js'
import commentsData from './data/comments.js'
import photosData from './data/photos.js'
import postsData from './data/posts.js'
import todosData from './data/todos.js'
import usersData from './data/users.js'

const app = express()

dotenv.config()
connectDb()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use('/images', express.static('images'))  // /images bosa baseURL/images/imageURL
app.use(express.static('images')) // bunda baseURL/imageURL

// STATIC PUG
// app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => res.render('index'))

const importData = async () => {
    try {
        await Albums.deleteMany()
        await Comments.deleteMany()
        await Photos.deleteMany()
        await Posts.deleteMany()
        await Todos.deleteMany()
        await Users.deleteMany()

        // users
        const createdUsers = await Users.insertMany(usersData)

        // todos
        let todosArr = []
        todosData.forEach((todo, index) =>
            todosArr.push({ ...todo, userId: createdUsers[Math.floor(index / 20)]?._id })
        )
        await Todos.insertMany(todosArr)

        // albums
        let albumsArr = []
        albumsData.forEach((album, index) =>
            albumsArr.push({ ...album, userId: createdUsers[Math.floor(index / 10)]?._id })
        )
        const createdAlbums = await Albums.insertMany(albumsArr)

        // posts
        let postsArr = []
        postsData.forEach((post, index) =>
            postsArr.push({ ...post, userId: createdUsers[Math.floor(index / 10)]?._id })
        )
        const createdPosts = await Posts.insertMany(postsArr)

        // comments
        let commentsArr = []
        commentsData.forEach((comment, index) =>
            commentsArr.push({ ...comment, postId: createdPosts[Math.floor(index / 5)]?._id })
        )
        await Comments.insertMany(commentsArr)

        // photos
        let photosArr = []
        photosData.forEach((photo, index) =>
            photosArr.push({ ...photo, albumId: createdAlbums[Math.floor(index / 2)]?._id })
        )
        await Photos.insertMany(photosArr)

        const imageUrl = './images/'
        fs.readdirSync('./images').map(image => fs.unlinkSync(imageUrl + image))

        console.log(`Data Imported`.green.inverse)
    } catch (error) {
        console.log(`${error}`.red.inverse)
    }
}

const usersM = await Users.find({})
const albumsM = await Albums.find({})
const commentsM = await Comments.find({})
const photosM = await Photos.find({})
const postM = await Posts.find({})

setInterval(() => {
    importData()
}, 1000 * 24 * 60 * 60)

if (!usersM.length && !albumsM.length && !commentsM.length && !photosM.length && !postM.length)
    importData()

app.use('/albums', albums) // done
app.use('/comments', comments) // done
app.use('/photos', photos)
app.use('/posts', posts) // done
app.use('/todos', todos) // done
app.use('/users', users) // done

app.listen(process.env.PORT || 5000, () =>
    console.log(`Server started on port -- ${process.env.PORT}`.yellow.bold)
)
