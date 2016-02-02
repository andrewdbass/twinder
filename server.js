var express = require('express')

var Twit = require('twit')

var T = new Twit({
	consumer_key: "xXhbcMXdbAZ9EPlmzIxslW0kZ",
	consumer_secret: "62r1Mrhrayd4lqlqYg6yqDgiFweLxEkNstZgpRq7DCAFxRrM77",
	access_token: " ",
	access_token_secret: " ",
	timeount_ms: 60*1000 

})

var app = express()
console.log("Server running. Listening on port 8080")

app.use(express.static('public'))

app.post('/api/tokens', function(req, res) {
	console.log(req.query.accesToken)
	T.acces_token = req.query.accesToken
	T.access_token_secret = req.query.accesTokenSecret
})

app.get('/api/getTweets/', function(req, res) {
	T.get('statuses/home_timeline',{count:200}, function(err, data) {
		if(err) console.log("error")
		else{
			res.send(data)
			res.end()
		}
	})
})


app.listen(8080);