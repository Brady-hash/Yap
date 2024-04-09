const typeDefs = `

type User{
    _id: ID
    username: String
    friends: [User]
    email: String
    password: String
    messageThreads: [MessageThread]
    answerChoices: [Answer]
    friendCount: Int
}

type Answer{
    _id: ID!
    userId: User
    questionId: Question
    answerChoice: String
}

type Question{
    _id: ID!
    creator: User
    messageThread: MessageThread
    text: String
    option1: String
    option2: String
    option1Count: Int
    option2Count: Int
    answerCount: Int
    answers: [Answer]
    option1Percentage: Float
    timestamp: String
    createdAt: String
}

type Message{
    _id: ID!
    text: String!
    sender: User
    messageThread: ID!
    timestamp: String
    createdAt: String
}

type Auth{
    token: ID!
    user: User
}

type MessageThread{
    _id: ID!
    name: String
    admins: [User]
    creator: ID
    participants: [User]
    messages: [Message]
    questions: [Question]
    isGroupChat: Boolean
    timestamp: String
    createdAt: String
}

type returnMessage{
    message: String!
}

type Friend{
    _id: ID
    username: String
}

type Query {
    users: [User]
    user(userId: ID!): User
    me: User
    threads: [MessageThread]
    thread(threadId: ID!): MessageThread
    mainPoll: Question

    #possibly adding these, could be overkill
    userThreads(userId: ID!): [MessageThread]
    userFriends(userId: ID!): [Friend]
    threadQuestions(threadId: ID!): [Question]
    questionAnswers(questionId: ID!): [Answer]
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String, email: String, password: String): User
    deleteUser(userId: ID!): User
    adminUser(threadId: ID!, userId: ID!): MessageThread
    removeAdmin(threadId: ID!, userId: ID!): MessageThread
    createThread(userId: ID!, name: String!, participantUsernames: [String!]): MessageThread
    deleteThread(threadId: ID!): returnMessage
    updateThread(threadId: ID!, name: String!): MessageThread
    addMessage(text: String!, userId: ID!, threadId: ID!): MessageThread
    updateMessage(messageId: ID!, text: String!): Message
    deleteMessage(messageId: ID!): returnMessage
    addFriend(userId: ID!, friendId: ID!): User
    removeFriend(userId: ID!, friendId: ID!): User
    joinThread(userId: ID!, threadId: ID!): MessageThread
    leaveThread(threadId: ID!): returnMessage
    createQuestion(messageThread: ID!, text: String!, option1: String!, option2: String!): MessageThread
    updateQuestion(userId: ID!, questionId: ID!, text: String, option1: String, option2: String): Question
    deleteQuestion(questionId: ID!): returnMessage
    answerQuestion(questionId: ID!, answer: String!): Question
}

`

module.exports = typeDefs;