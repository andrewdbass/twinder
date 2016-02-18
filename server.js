var express = require('express')

var Twit = require('twit')


var Twits = []

var app = express()
console.log("Server running. Listening on port 8080")

var createTwit = function(username, accessToken, accessTokenSecret){
	var T = new Twit({
		consumer_key: "xXhbcMXdbAZ9EPlmzIxslW0kZ", 
		consumer_secret: "62r1Mrhrayd4lqlqYg6yqDgiFweLxEkNstZgpRq7DCAFxRrM77", 
		access_token: accessToken,	
		access_token_secret: accessTokenSecret,
		timeount_ms: 60*1000 
	})
	Twits[username] = T
}

app.use(express.static('public'))

app.post('/api/tokens', function(req, res) {
	createTwit(req.query.username, req.query.accessToken, req.query.accessTokenSecret)	
	res.end()
})

app.get('/api/getTweets/:username/:since', function(req, res) {
	console.log(req.params.since)
	var T = Twits[req.params.username]
	T.get('statuses/home_timeline',{count:200, since_id:req.params.since}, function(err, data) {
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

app.post('/api/tweet/:username/:statusText', function(req, res){
	var T = Twits[req.params.username]
	T.post('statuses/update',{status: req.params.statusText}, function(err, data){
		if(err){
			console.log(err)
			res.end()
		}
		else{
			res.end()
		}
	})
})
//reply
app.post("/api/reply/:username/:replyToId/:statusText", function(req, res) {
	var T = Twits[req.params.username]
	T.post('statuses/update', {in_reply_to_status_id: req.params.replyToId, status: req.params.statusText}, function(err, data){
		if(err){
			console.log(err)
			res.end()
		}
		else{
			res.end()
		}
	})
})

app.get('/api/getTweets/:username', function(req, res) {
	var T = Twits[req.params.username]
	T.get('statuses/home_timeline',{count:20}, function(err, data) {
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
app.post('/api/favoriteTweet/:username/:tweetId', function(req, res) {
	console.log(req.params.tweetId)
	var T = Twits[req.params.username]
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
app.post('/api/unfavoriteTweet/:username/:tweetId', function(req, res) {
	console.log(req.params.tweetId)
	var T = Twits[req.params.username]
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
app.post('/api/retweet/:username/:tweetId', function(req, res) {
	console.log(req.params.tweetId)
	var T = Twits[req.params.username]
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
app.post('/api/unretweet/:username/:tweetId', function(req, res) {
	console.log(req.params.tweetId)
	var T = Twits[req.params.username]
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


app.listen(process.env.PORT);