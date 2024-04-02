const typeDefs = `

type User{
    _id: ID
    username: String
    email: String
    password: String
    messagesThreads: [ID!]
    answerChoices: [ID!]
}

type Message{
    _id: ID!
    text: String!
    sender: ID!
    messageThread: ID!
    timestamp: String
}

type MessageThread{
    _id: ID!
    participants: [ID!]
    messages: [Message]
    isGroupChat: Boolean
}

type Query {
    users: [User]
    user(userId: ID!): User
}

type Mutation {
    addUser(username: String!, email: String!, password: String!): User
}

`

module.exports = typeDefs;