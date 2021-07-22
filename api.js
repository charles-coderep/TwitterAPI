require('dotenv').config();
const T = require('./twit.js');

let params = {
    q: '#trump',
    result_type: 'recent',
    count: 2
};

function twitData(err, data, response) {
    let tweets = data.statuses
    tweets.forEach((tweet) => {
        console.log(tweet);
    });
};

T.get('search/tweets', params, twitData);



/*
Rate limts: GET search/tweets	450 tweets per 15 mins
https://developer.twitter.com/en/docs/twitter-api/v1/rate-limits
*/
