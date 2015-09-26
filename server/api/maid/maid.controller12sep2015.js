/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /maid              ->  index
 * POST    /maid              ->  create
 * GET     /maid/:id          ->  show
 * PUT     /maid/:id          ->  update
 * DELETE  /maid/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Maid = require('./maid.model');
var fs = require('fs');
var uuid = require('node-uuid');
var multiparty = require('multiparty');
var gm = require('gm').subClass({ imageMagick: true });

// Get list of things
exports.index = function(req, res) {
	var skip = parseInt(req.body.pageNumber) - 1;
	var maidsPerPage = parseInt(req.body.maidsPerPage)
	skip = skip * maidsPerPage ;
	
	
  Maid.find().skip(skip).limit(maidsPerPage).exec(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};

exports.test = function(req,res){
    Maid.find(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};

// Get a single thing
exports.show = function(req, res) {
  Maid.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    return res.json(thing);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
    //return res.json(201, req.body);
  Maid.create(req.body, function(err, maid) {
    if(err) { return handleError(res, err); }
    return res.json(201, maid);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Maid.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Maid.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    thing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Deletes a thing from the DB.
exports.uploadImage = function(req, res) {
  var form = new multiparty.Form();
		form.parse(req, function(err, fields, files) {
			var file = files.file[0];
			var contentType = file.headers['content-type'];
			var tmpPath = file.path;
			var extIndex = tmpPath.lastIndexOf('.');
			var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
			// uuid is for generating unique filenames. 
			var fileName = uuid.v4() + extension;
			var destPath = 'client/assets/uploads/maids/org/' + fileName;
			var imagename = fileName;
			// Server side file type checker.
			if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
				fs.unlink(tmpPath);
				return res.status(400).send('Unsupported file type.');
			}
			fs.rename(tmpPath, destPath, function(err) {
				if (err) {
					return res.status(400).send('Image is not saved:');
				} else {
					gm(destPath)
					.resize('200', '200', '^')
					.gravity('Center')
					.crop('200', '200')
					.write('client/assets/uploads/maids/thumbnail/' + fileName, function (err) {
						if (err) console.log(err);
						return res.json({'destPath': destPath, 'imagename': fileName});
					});
				}
			});
		});
};

function handleError(res, err) {
  return res.send(500, err);
}
