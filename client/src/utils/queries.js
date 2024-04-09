import { gql } from '@apollo/client';

export const QUERY_ONE_USER = gql`
query user($userId: ID!) {
  user(userId: $userId) {
    _id
    username
    friendCount
    friends {
      _id
      username
    }
    messageThreads {
      _id
      name
    }
    answerChoices {
      answerChoice
      _id
      questionId {
        _id
        text
        option1
        option2
      }
    }
  }
}
`;

export const QUERY_ONE_USER_PROFILE = gql`
query user($userId: ID!) {
  user(userId: $userId) {
    username
    email
    friendCount
    answerChoices {
      answerChoice
    }
  }
}
`;

export const QUERY_ALL_USERS= gql`
query users{
  users {
    _id
    username
    friendCount
    friends {
      _id
      username
    }
    messageThreads {
      _id
      name
    }
    answerChoices {
      answerChoice
      _id
      questionId {
        _id
        text
        option1
        option2
      }
    }
  }
} 
`;

export const QUERY_ALL_THREADS = gql`
query threads {
    threads {
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

export const QUERY_ONE_THREAD = gql`
query thread($threadId: ID!){
  thread(threadId: $threadId) {
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

export const QUERY_ME = gql`
query me{
  me{
      _id
      username
      email
      friendCount
      friends {
        _id
        username
      }
      messageThreads {
      _id
      name
      }
  }
}
`;

export const QUERY_MAIN_POLL = gql`
  query GetMainPoll {
    mainPoll {
      _id
      text
      option1
      option2
      option1Count
      option2Count
    }
  }
`;