const typeDefs = `

type User{
    _id: ID
    username: String
    friends: [User]
    email: String
    password: String
    messageThreads: [MessageThread]
    answerChoices: [ID!]
    friendCount: Int
}

type Message{
    _id: ID!
    text: String!
    sender: User
    messageThread: ID!
    timestamp: String
}

type MessageThread{
    _id: ID!
    name: String
    admin: User
    participants: [User]
    messages: [Message]
    isGroupChat: Boolean
    createdAt: String
}

type Query {
    users: [User]
    user(userId: ID!): User
    threads: [MessageThread]
    thread(threadId: ID!): MessageThread
}

type Mutation {
    addUser(username: String!, email: String!, password: String!): User
    updateUser(userId: ID!, username: String, email: String, password: String): User
    deleteUser(userId: ID!): User
    createThread(userId: ID!, name: String!): MessageThread
    deleteThread(threadId: ID!, userId: ID!): MessageThread
    updateThread(threadId: ID!, userId: ID!, name: String!): MessageThread
    addMessage(text: String!, userId: ID!, threadId: ID!): MessageThread
    updateMessage(userId: ID!, messageId: ID!, text: String!): Message
    deleteMessage(messageId: ID!, userId: ID!): Message
    addFriend(userId: ID!, friendId: ID!): User
    removeFriend(userId: ID!, friendId: ID!): User
    joinThread(userId: ID!, threadId: ID!): MessageThread
    leaveThread(userId: ID!, threadId: ID!): User
}

`

module.exports = typeDefs;