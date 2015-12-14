var Promise = require('bluebird')
var Lane = require('mongoose').model('Lane');

var updateLabels = function(labels, repo) {
  return Promise.map(labels, function(label) {
    return Label.findOneAndUpdate({board: repo, name: label.name}, label, {new: true, upsert: true})
  })
}


module.exports = {
  updateLanes: updateLanes
}
