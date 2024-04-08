require('dotenv').config()
const algoliasearch = require('algoliasearch');

const client = algoliasearch( process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
const usersIndex = client.initIndex('usersIndex');
const threadsIndex = client.initIndex('threadsIndex');

module.exports = { usersIndex, threadsIndex };