var Promise = require('bluebird')

//This parser takes an array of objects, where on each object there is one field that is a promise.  It resolves this promise, a returns a promise for the whole array.

module.exports = function(promises, field) {
	if(Array.isArray(promises)) {
		return Promise.map(promises, function(promise) {
			return Promise.resolve(promise[field])
			.then(function(resolved){
				return promise
			})
		})
	}
}
