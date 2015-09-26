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
var Maid = require('../maid/maid.model');

// Get list of things

//  Maid.find(function (err, things) {
//    if(err) { return handleError(res, err); }
//    return res.json(200, things);
//  });
exports.index = function (req, res) {
    var skip = parseInt(req.query.pageNumber) - 1;
    var maidsPerPage = parseInt(req.query.maidsPerPage)
    var loc_name = '';
    if (req.query.loc_name) {
        loc_name = req.query.loc_name;
    }
    skip = skip * maidsPerPage;

    Maid.find({location: new RegExp(loc_name, 'i')}).skip(skip).limit(maidsPerPage).exec(function (err, things) {
        if (err) {
            return handleError(res, err);
        }

        var data = {};
        data.data = things;
        Maid.count(function (err, count) {
            data.count = count;
            return res.json(200, [data]);
        });
    });
};


exports.test = function (req, res) {
    return res.json(200, {'name': 'varun'});
};

exports.compare_maid = function (req, res) {
    Maid.find({_id: {$in: req.body}}, function (err, maids) {
        return res.json(200, maids);
    });
};
exports.getMaidById = function (req, res) {
    Maid.findById(req.params.id, function (err, maids) {
        if (err) {
            return handleError(res, err);
        }
        if (!maids) {
            return res.send(404);
        }
        return res.json(maids);
    });
};

exports.search_maid = function (req, res) {

    var obj = {};
    if (req.body.memberType != undefined && req.body.memberType != "" && req.body.memberType != "both") {
        console.log(req.body.memberType);
        obj.memberType = req.body.memberType;
    }
    if (req.body.firstname != undefined && req.body.firstname != "") {
        obj.firstname = req.body.firstname;
    }
    if (req.body.lastname != undefined && req.body.lastname != "") {
        obj.lastname = req.body.lastname;
    }
    if (req.body.age != undefined && req.body.age != "") {
        obj.age = parseInt(req.body.age);
    }
    if (req.body.gender != undefined && req.body.gender != "" && req.body.gender != "both") {
        obj.gender = req.body.gender.toLowerCase();
    }
    if (req.body.meal_type != undefined && req.body.meal_type != "" && req.body.meal_type != "both") {
        obj.meal_type = req.body.meal_type.toLowerCase();
    }
    if (req.body.specialityarr != undefined && req.body.specialityarr != '') {
        var spec = req.body.specialityarr;
        console.log(spec.special.length);
        if (spec.special.length > 0) {
            obj.speciality = {$in: spec.special};
        }
    }
    if (req.body.price != undefined && req.body.price != '') {
        obj.price_per_person = {$lt: req.body.price.maxPrice, $gt: req.body.price.minPrice};
    }
    if (req.body.exp != undefined && req.body.exp != '') {
        obj.experience = {$lt: req.body.exp.maxExp, $gt: req.body.exp.minExp};
    }
    Maid.find(obj).
            exec(function (err, data) {
                return res.json(200, data);
            });

}

// Get a single thing
exports.show = function (req, res) {
    Maid.findById(req.params.id, function (err, thing) {
        if (err) {
            return handleError(res, err);
        }
        if (!thing) {
            return res.send(404);
        }
        return res.json(thing);
    });
};

// Creates a new thing in the DB.
exports.create = function (req, res) {
    //return res.json(201, req.body);
    Maid.create(req.body, function (err, maid) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, maid);
    });
};

// Updates an existing thing in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Maid.findById(req.params.id, function (err, thing) {
        if (err) {
            return handleError(res, err);
        }
        if (!thing) {
            return res.send(404);
        }
        var updated = _.merge(thing, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, thing);
        });
    });
};

// Deletes a thing from the DB.
exports.destroy = function (req, res) {
    Maid.findById(req.params.id, function (err, thing) {
        if (err) {
            return handleError(res, err);
        }
        if (!thing) {
            return res.send(404);
        }
        thing.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}
