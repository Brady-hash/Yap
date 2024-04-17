const { MongoClient } = require('mongodb');

const { usersIndex , threadsIndex } = require('./algoliaClient');
require('dotenv').config();

const MONGODB_URI = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://127.0.0.1:27017/yap';

const syncData = async () => {
  const mongoClient = new MongoClient(MONGODB_URI);

  try {
    await mongoClient.connect();
    console.log('Connected to MongoDB');
    
    const db = mongoClient.db();
    const users = await db.collection('users').find().toArray();
    const threads = await db.collection('messagethreads').find().toArray();

    const algoliaUsers = users.map(doc => ({
        objectID: doc._id.toString(),
        username: doc.username,
      }));
      const algoliaThreads = threads.map(doc => ({
        objectID: doc._id.toString(),
        name: doc.name,
        participants: doc.participants
      }));

    await usersIndex.saveObjects(algoliaUsers);
    await threadsIndex.saveObjects(algoliaThreads)
    console.log('Data synced to algolia');
  } catch (err) {
    console.error('Error syncing data to algolia:', err);
  } finally {
    await mongoClient.close();
  }
}

syncData();

module.exports = syncData