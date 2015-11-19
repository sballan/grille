// This is a module of parser functions which contain logic to turn the json returned by GitHub into useable objects that we can use/persist
module.exports = {
	user: require('./user.parser'),
	repo: require('./repo.parser'),
	issue: require('./issue.parser'),
	comment: require('./comment.parser')
}