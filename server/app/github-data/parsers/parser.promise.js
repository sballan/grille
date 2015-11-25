module.exports = function(obj, prop) {
	var promises = [];
	if(Array.isArray(obj)) {
		obj.forEach(function(elem) {
			promises.push(elem[prop])
		})
	}

	return promises
}
