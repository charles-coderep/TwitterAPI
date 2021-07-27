# TwitterAPI

## Description

Retrieve 100 newest tweets while respecting the rate limits of the Twitter API.
Rate limits of Twitter API in app context are:

- GET /2/tweets/counts/recent - 300req / 15min
- GET /2/tweets/search/recent - 450req / 15min / 100 tweets per request

## Part Solution

An endpoint was created at http://localhost:3000/twitter/hashtag/:hashtag. When it is hit it runs a callback function which:

- Checks the redis cache if there is data in
- If there is no data (first request or expired data), get Twitter data
- Flatten the object and turn into array with key value pair so that it can be iterated through
- Create new array of objects with required fields and set it to Redis cache with 100 second time expiry
- Any subsequent requests before 100s will retrieve cached data

### Sample output

    [{
        "tweet_id_0": "1420007677359493143",
        "retweet_count_0": 0,
        "tweet_text_0": "#Extermination #Democracy #Freedom #Discrimination #Hegemony https://t.co/On8KrtXuox",
        "tweet_date_ 0": "2021-07-27T13:06:27.000Z",
        "user_screen_name_0": "SarahTa92570277",
        "user_image_ 0": "https://pbs.twimg.com/profile_images/1410449022956015618/QzUc8EbM_normal.jpg",
        "user_name_0": "Sarah Taylor"
    }, {
        "tweet_id_1": "1420007592181608449",
        "retweet_count_1": 5,
        "tweet_text_1": "RT @HumanRights4UK: #FREEDOM is what unites us all. \n\nIt transcends race, nationality, politics et al. \n\nThey want to take it away. \nWe mus…",
        "tweet_date_ 1": "2021-07-27T13:06:07.000Z",
        "user_screen_name_1": "HHelenakhl",
        "user_image_ 1": "https://pbs.twimg.com/profile_images/885974257909592065/WXvRwxWJ_normal.jpg",
        "user_name_1": "HelenaTroy 🌸🇫🇷"
    },
    .
    .
    .

## Still to implement

Do a recent tweet count search every 3 sec (within rate limit) untill it shows a count of 100 tweets for particular hashtag. If found, flush the redis key, then get 100 newest tweets and save to cache while taking other constraints in consideration.
