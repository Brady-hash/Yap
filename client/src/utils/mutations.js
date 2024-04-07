import { gql } from '@apollo/client';
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!){
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        password
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($username: String, $email: String, $password: String) {
    updateUser(username: $username, email: $email, password: $password) {
      _id
      username
      email
      password
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($userId: ID!) {
    deleteUser(userId: $userId) {
      _id
      username
      email
    }
  }
`;
export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const CREATE_THREAD = gql`
  mutation createThread($userId: ID!, $name: String!){
    createThread(userId: $userId, name: $name) {
      _id
      name
      admin {
        _id
        username
      }
      participants {
        _id
        username
      }
      isGroupChat
      createdAt
    }
  }
`;

export const DELETE_THREAD = gql`
  mutation deleteThread($threadId: ID!){
    deleteThread(threadId: $threadId) {
      message
    }
  }
`
export const UPDATE_THREAD = gql`
  mutation updateThread($threadId: ID!, $name: String!) {
    updateThread(threadId: $threadId, name: $name) {
      _id
    name
    isGroupChat
    timestamp
    creator
    createdAt
    admins {
      _id
      username
    }
    participants {
      _id
      username
    }
    questions {
      _id
      text
      option1
      option2
      option1Count
      option2Count
      option1Percentage
      answerCount
      createdAt
      timestamp
      answers {
        _id
        userId {
          _id
        }
        answerChoice
      }
    }
    messages {
      _id
      text
      messageThread
      createdAt
      timestamp
      sender {
        _id
        username
      }
    }
    }
  }
`;
export const ADD_MESSAGE = gql`
  mutation addMessage($text: String!, $userId: ID!, $threadId: ID!) {
    addMessage(text: $text, userId: $userId, threadId: $threadId) {
      _id
      name
      isGroupChat
      admins {
        _id
        username
      }
      participants {
        _id
        username
      }
      messages {
        _id
        text
        messageThread
        timestamp
        sender {
          _id
          username
        }
      }
    }
  }
`;
export const UPDATE_MESSAGE = gql`
mutation updateMessage($messageId: ID!, $text: String!) {
    updateMessage(messageId: $messageId, text: $text) {
      _id
      text
      messageThread
      timestamp
      sender {
        _id
        username
      }
    }
  }
`;
export const DELETE_MESSAGE = gql`
mutation deleteMessage($messageId: ID!) {
    deleteMessage(messageId: $messageId) {
      message
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation addFriend($userId: ID!, $friendId: ID!){
    addFriend(userId: $userId, friendId: $friendId) {
      _id
      username
      friends {
        _id
        username
      }
    }
  }

`
export const REMOVE_FRIEND = gql`
  mutation removeFriend($userId: ID!, $friendId: ID!){
    removeFriend(userId: $userId, friendId: $friendId) {
      _id
      username
      friendCount
      friends {
        _id
        username
      }
    }
  }

`
export const JOIN_THREAD = gql`
mutation joinThread($userId: ID!, $threadId: ID!) {
    joinThread(userId: $userId, threadId: $threadId) {
      _id
      name
      admin {
        _id
        username
      }
      isGroupChat
      createdAt
      participants {
        _id
        username
      }
    }
  }
`;

export const LEAVE_THREAD = gql`
  mutation leaveThread($threadId: ID!){
    leaveThread(threadId: $threadId) {
      message
    }
  }
`;

export const UPDATE_QUESTION = gql`
  mutation updateQuestion($userId: ID!, $questionId: ID!, $option1: String, $option2: String, $text: String){
    updateQuestion(userId: $userId, questionId: $questionId, option1: $option1, option2: $option2, text: $text) {
      _id
      creator {
        _id
        username
      }
      messageThread {
        _id
        name
      }
      text
      option1
      option2
      createdAt
    }
  }
`;

export const CREATE_QUESTION = gql`
  mutation createQuestion($userId: ID!, $messageThread: ID!, $text: String!, $option1: String!, $option2: String!){
    createQuestion(userId: $userId, messageThread: $messageThread, text: $text, option1: $option1, option2: $option2) {
      _id
      messageThread {
        _id
        name
      }
      creator {
        _id
        username
      }
      text
      option1
      option2
      answerCount
      timestamp
    }
  }
`;

export const DELETE_QUESTION = gql`
  mutation deleteQuestion($questionId: ID!){
    deleteQuestion(questionId: $questionId) {
      message
    }
  }
`;
export const ANSWER_QUESTION = gql`
  mutation answerQuestion($questionId: ID!, $answer: String!){
    answerQuestion(questionId: $questionId, answer: $answer) {
      _id
      creator {
        _id
        username
      }
      messageThread {
        _id
        name
      }
      text
      option1
      option2
      option1Count
      option2Count
      answerCount
      option1Percentage
      answers {
        _id
        userId {
          _id
          username
        }
        answerChoice
      }
    }
  }
`;

export const ADMIN_USER = gql`
mutation adminUser($threadId: ID!, $userId: ID!){
  adminUser(threadId: $threadId, userId: $userId) {
      _id
      name
      isGroupChat
      timestamp
      createdAt
      admins {
        _id
        username
      }
  }
}
`;

export const REMOVE_ADMIN = gql`
mutation removeAdmin($threadId: ID!, $userId: ID!){
  removeAdmin(threadId: $threadId, userId: $userId) {
      _id
      name
      isGroupChat
      timestamp
      createdAt
      admins {
        _id
        username
      }
  }
}
`;
