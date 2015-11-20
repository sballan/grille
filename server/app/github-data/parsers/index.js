// This is a module of parser functions which contain logic to turn the json returned by GitHub into useable objects that we can use/persist
module.exports = {
	user: require('./parser.user'),
	repo: require('./parser.repo'),
	issue: require('./parser.issue'),
	comment: require('./parser.comment')
}