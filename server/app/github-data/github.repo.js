var http = require('http')
  , url = require('url')
  , qs = require('querystring')
  , github = require('octonode');



  var id = require("../../env").GITHUB.clientID
  var secret = require("../../env").GITHUB.clientSecret


  var client = github.client({
  	id: id,
  	secret: secret
  })

  var ghuser = client.user('sballan')


module.exports = {
  	getUser: function(accessToken) {
      //OP: What is going on here?
  		return client.get('/user', function(err, status, body) {
	  		ghuser.info(function(stuff){
	  		})
  		})
  	}
  }


