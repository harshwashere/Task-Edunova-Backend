import User from '../models/user-model.js'

const getUsers = async (req, res) => {
    try {
        const user = await User.find()

        if(!user) return res.status(200).json({Message: "No users found"})

        return res.status(200).json({user})
    } catch (error) {
        return res.status(500).json({Message: 'Internal Server Error'})
    }
}

export default getUsers