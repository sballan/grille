var repo = require('./github.repo')

//OP: Export repo directly, no need for object unless you plan to add other things
module.exports = {
	repo: repo
}