'use strict';

const getAll = function(req, res, next) {
  if(!req.griller || !req.griller.repo) res.sendStatus(404);
  console.log("getAllRepoLabels")
  return req.griller.repo.getAllLabels()
    .then(labels=> res.json(labels))
    .catch(next)
};


module.exports = {
  getAll
};
