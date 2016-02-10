var express = require('express')

var Twit = require('twit')

var T ={}

var app = express()
console.log("Server running. Listening on port 8080")

var createTwit = function(accessToken, accessTokenSecret){
	T = new Twit({
		consumer_key: "xXhbcMXdbAZ9EPlmzIxslW0kZ", 
		consumer_secret: "62r1Mrhrayd4lqlqYg6yqDgiFweLxEkNstZgpRq7DCAFxRrM77", 
		access_token: accessToken,	
		access_token_secret: accessTokenSecret,
		timeount_ms: 60*1000 
	})
}

app.use(express.static('public'))

app.post('/api/tokens', function(req, res) {
	createTwit(req.query.accessToken, req.query.accessTokenSecret)	
	res.end()
})

app.get('/api/getTweets/:since', function(req, res) {
	console.log(req.params.since)
	T.get('statuses/home_timeline',{count:20, since_id:req.params.since}, function(err, data) {
		if(err){
			console.log(err)
			res.end()
		}
		else{
			res.send(data)
			res.end()
		}
	})
})

app.get('/api/getTweets/', function(req, res) {
	T.get('statuses/home_timeline',{count:200}, function(err, data) {
		if(err){
			console.log(err)
			res.end()
		}
		else{
			res.send(data)
			res.end()
		}
	})
})
//favorite a tweet
app.post('/api/favoriteTweet/:tweetId', function(req, res) {
	console.log(req.params.tweetId)
	T.post('favorites/create',{id: req.params.tweetId}, function(err, data) {
		if(err){
			console.log(err)
			res.end()
		}
		else{
			res.send(data)
			res.end()
		}
	})
})
app.post('/api/unfavoriteTweet/:tweetId', function(req, res) {
	console.log(req.params.tweetId)
	T.post('favorites/destroy',{id: req.params.tweetId}, function(err, data) {
		if(err){
			console.log(err)
			res.end()
		}
		else{
			res.send(data)
			res.end()
		}
	})
})
//retweet
app.post('/api/retweet/:tweetId', function(req, res) {
	console.log(req.params.tweetId)
	T.post('statuses/retweet',{id: req.params.tweetId}, function(err, data) {
		if(err){
			console.log(err)
			res.end()
		}
		else{
			res.send(data)
			res.end()
		}
	})
})
//unretweet
app.post('/api/unretweet/:tweetId', function(req, res) {
	console.log(req.params.tweetId)
	T.post('statuses/unretweet',{id: req.params.tweetId}, function(err, data) {
		if(err){
			console.log(err)
			res.end()
		}
		else{
			res.send(data)
			res.end()
		}
	})
})


app.listen(8080);