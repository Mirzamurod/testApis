import dotenv from 'dotenv'
import colors from 'colors'
import fs from 'fs'
import connectDB from './config/db.js'

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

dotenv.config()

connectDB()

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
        process.exit()
    } catch (error) {
        console.log(`${error}`.red.inverse)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await Albums.deleteMany()
        await Comments.deleteMany()
        await Photos.deleteMany()
        await Posts.deleteMany()
        await Todos.deleteMany()
        await Users.deleteMany()

        console.log('Data Destroyed!'.red.inverse)
        process.exit()
    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

if (process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}
