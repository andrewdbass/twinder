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

app.get('/api/getTweets/', function(req, res) {
	T.get('statuses/home_timeline',{count:200}, function(err, data) {
		if(err){
			console.log("error")
			res.end()
		}
		else{
			res.send(data)
			res.end()
		}
	})
})


app.listen(8080);