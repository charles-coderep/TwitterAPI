# TwitterAPI

## Description

Retrieve 100 newest tweets while respecting the rate limits of the Twitter API.
Rate limits of Twitter API are:

 * Rate limits for app context:
 * GET /2/tweets/counts/recent - 300req / 15min
 * GET /2/tweets/search/recent - 450req / 15min / 100 tweets per request

## Part Solution
An endpoint was created at http://localhost:3000/twitter/hashtag/:hashtag. When it is hit it runs a callback function which:
- Checks the redis cache if there is data in
- If there is no data (first request or expired data), get Twitter data
- Flatten the object and turn into array with key value pair so that it can be iterated through
- Create new array of objects with required fields and set it to Redis cache with 100 second time expiry
- Any subsequent requests before 100s will retrieve cached data

## Still to implement
Do a recent tweet count search every 3 sec (within rate limit) untill it shows a count of 100 tweets for particular hashtag. If found, flush the redis key, then get 100 newest tweets and save to cache while taking other constraints in consideration.

