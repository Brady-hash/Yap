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
  mutation updateUser($userId: ID!, $username: String, $email: String, $password: String) {
    updateUser(userId:$userId ,username: $username, email: $email, password: $password) {
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
  mutation deleteThread($threadId: ID!, $userId: ID!){
    deleteThread(threadId: $threadId, userId: $userId) {
      _id
      name
    }
  }  
`

export const UPDATE_THREAD = gql`
  mutation updateThread($threadId: ID!, $userId: ID!, $name: String!) {
    updateThread(threadId: $threadId, userId: $userId, name: $name) {
      _id
      name
      isGroupChat
      participants {
        _id
        username
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
      admin {
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
mutation updateMessage($userId: ID!, $messageId: ID!, $text: String!) {
    updateMessage(userId: $userId, messageId: $messageId, text: $text) {
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
mutation deleteMessage($messageId: ID!, $userId: ID!) {
    deleteMessage(messageId: $messageId, userId: $userId) {
      _id
      text
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
  mutation leaveThread($userId: ID!, $threadId: ID!){
    leaveThread(userId: $userId, threadId: $threadId) {
      _id
      username
      messageThreads {
        _id
        name
      }
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
      createdAt
    }
  }
`;

export const DELETE_QUESTION = gql`
  mutation deleteQuestion($userId: ID!, $questionId: ID!){
    deleteQuestion(userId: $userId, questionId: $questionId) {
      message
    }
  }  
`;

export const ANSWER_QUESTION = gql`
  mutation answerQuestion($userId: ID!, $questionId: ID!, $answer: String!){
    answerQuestion(userId: $userId, questionId: $questionId, answer: $answer) {
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
      answerCount
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
`
