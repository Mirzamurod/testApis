import mongoose from 'mongoose'

const UsersSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        website: { type: String, required: true, default: 'example@gmail.com' },
        address: {
            street: { type: String, required: true, default: 'addres street' },
            suite: { type: String, required: true, default: 'addres suite' },
            city: { type: String, required: true },
            zipcode: { type: String, required: true, default: 'addres zipcode' },
            geo: {
                lng: { type: String, required: true, default: '-37.3159' },
                lat: { type: String, required: true, default: '81.1496' },
            },
        },
        company: {
            name: { type: String, required: true, default: 'Romaguera-Crona' },
            catchPhrase: {
                type: String,
                required: true,
                default: 'Multi-layered client-server neural-net',
            },
            bs: { type: String, required: true, default: 'harness real-time e-markets' },
        },
    },
    {
        timestamps: false,
    }
)

const Users = mongoose.model('Users', UsersSchema)

export default Users
