import mongoose from 'mongoose'

const connectDb = async () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose
            .connect(process.env.MONGO_URL)
            .then(res => console.log(`Mongo Connected: ${res.connection.host}`.cyan.underline))
    } catch (err) {
        console.log(`Error: ${err.message}`.red.underline.bold)
    }
}
export default connectDb
