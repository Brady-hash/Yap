const models = require('../models');
const db = require('../config/connection');

const cleanDb = async (modelName, collectionName) => {
    try {
        let modelExists = await models[modelName].db.db.listCollections({
          name: collectionName
        }).toArray()
    
        if (modelExists.length) {
          await db.dropCollection(collectionName);
        }
      } catch (err) {
        throw err;
      }
}

const cleanAll = async () => {
    await cleanDb('User', 'users');
    await cleanDb('MessageThread', 'messagethreads');
    await cleanDb('Message', 'messages');
    await cleanDb('Question', 'questions');
    await cleanDb('Answer', 'answers');
}

module.exports = cleanAll