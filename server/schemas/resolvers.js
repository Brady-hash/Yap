const { User } = require('../models');

const resolvers = {
    Query: {
        users: async () => {
            return await User.find();
        },
        user: async (parent, { userId }) => {
            return await User.findById(userId)
        }
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            return await User.create({ username, email, password });
        },
        // updateUser: async (parent, { username, email, password }) => {
            
        // }
    }
}

module.exports = resolvers;