const Twit = require('twit');

let T = new Twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    app_only_auth: true
})

module.exports = T;