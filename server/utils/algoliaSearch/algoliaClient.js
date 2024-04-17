require('dotenv').config();
const algoliasearch = require('algoliasearch');
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
const threadsIndex = process.env.NODE_ENV === 'production' ? client.initIndex('threadsIndex') : client.initIndex('dev_YAP_THREADS');
const usersIndex = process.env.NODE_ENV === 'production' ? client.initIndex('usersIndex') : client.initIndex('dev_YAP_USERS');

module.exports = { usersIndex, threadsIndex };