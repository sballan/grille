// This is a module of parser functions which contain logic to turn the json returned by GitHub into useable objects that we can use/persist
var obj = {
	user: require('./parser.user'),
	repo: require('./parser.repo'),
	issue: require('./parser.issue'),
	comment: require('./parser.comment'),
}

// This function might be useful to call the various parse function all in one shot.
var payload = function (body) {
	//console.log("------Payload Function", body)

	var data = {}
	data.repo = obj.repo(body.repository)
	data.sender = obj.user(body.sender)
	// obj.user(body.sender)
	// .then(functino(sender){
	// 	data.sender = sender
	// })
	data.assignee = obj.user(body.assignee)
	data.issue = obj.issue(body.issue)
	data.comment = obj.comment(body.comment)

	data.action = body.action
	data.label = body.label
	data.member = obj.user(body.member)
	return data
}

obj.payload = payload

module.exports = obj