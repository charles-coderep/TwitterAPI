/**
 * Retrieve 100 new searches for any given Twitter hastag while respecting the rate limits.
 * Rate limits for app context:
 * GET /2/tweets/counts/recent - 300req / 15min
 * GET /2/tweets/search/recent - 450req / 15min / 100 tweets per request
 */

require('dotenv').config();
const needle = require('needle');
const express = require('express');
const Redis = require('redis');
const flatten = require('flat')
const app = express();

const PORT = process.env.PORT || 3000;
const REDIS_PORT = process.env.PORT || 6379;
const token = process.env.TWITTER_BEARER_TOKEN;
const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

const clientCache = Redis.createClient(REDIS_PORT);

const getRequest = async (req, res, next) => {

    const hashtag = req.params.hashtag;

    const params = {
        'query': '#' + hashtag,
        'expansions': 'author_id',
        'user.fields': 'name,username,profile_image_url',
        'tweet.fields': 'public_metrics,text,created_at',
        'max_results': '10' // change to 100 later
    }

    try {
        // Make request

        clientCache.get('tweets', async (error, data) => {
            if (error) console.log(error);
            if (data != null) {
                return res.json(JSON.parse(data));
            } else {
                const twitterRes = await needle('get', endpointUrl, params, {
                    headers: {
                        "User-Agent": "v2RecentSearchJS",
                        "authorization": `Bearer ${token}`
                    }
                });

                const twData = await twitterRes.body;
                const twArray = (Object.entries(flatten(twData)));
                let newTwArray = [];
                let newTwObj = {};

                for (let i = 0; i < 10; i++) {

                    for (let j = 0; j < twArray.length; j++) {

                        switch (twArray[j][0]) {
                            case 'data.' + i + '.id':
                                newTwObj['tweet_id_' + i] = twArray[j][1];
                                break;
                            case 'data.' + i + '.text':
                                newTwObj['tweet_text_' + i] = twArray[j][1];
                                break;
                            case 'includes.users.' + i + '.name':
                                newTwObj['user_name_' + i] = twArray[j][1];
                                break;
                            case 'includes.users.' + i + '.username':
                                newTwObj['user_screen_name_' + i] = twArray[j][1];
                                break;
                            case 'includes.users.' + i + '.profile_image_url':
                                newTwObj['user_image_ ' + i] = twArray[j][1];
                                break;
                            case 'data.' + i + '.created_at':
                                newTwObj['tweet_date_ ' + i] = twArray[j][1];
                                break;
                            case 'data.' + i + 'public_metrics.like_count':
                                newTwObj['likes_' + i] = twArray[j][1];
                                break;
                            case 'data.' + i + '.public_metrics.retweet_count':
                                newTwObj['retweet_count_' + i] = twArray[j][1];
                                break;
                        }
                    }
                    newTwArray.push(newTwObj);
                }
                clientCache.setex('tweets', 100, JSON.stringify(newTwArray));
                res.json(newTwArray);

            }
        });

    } catch (e) {
        console.log(e);
        process.exit(-1);
    }
}

app.get("/twitter/hashtag/:hashtag", getRequest);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});