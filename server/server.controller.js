
var async = require('async');

var mysql = require('../config/lib/mysql').mysql;
var computeFillist = require('./compute.fillist.js');

exports.sendIndexFile = function (req, res) {
    res.sendfile('./public/index.html');
};

exports.getInstrumentPosition = function (req, res) {
    var id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ 'message': 'Invalid ID' });
    } else {
        mysql.query('select INST_ID as id, POSITION as position from fillist where INST_ID = ' + id, function (error, results, fields) {
            if (error) {
                res.status(400).json({ 'message': 'Database error', 'description': error });
            } else {
                if (results.length === 0) {
                    res.status(400).json({ 'message': 'Invalid ID' });
                } else {
                    res.json(results[0]);
                }
            }
        });
    }
};

exports.getAllInstrumentsPosition = function (req, res) {

    mysql.query('select INST_ID as id, POSITION as position from fillist', function (error, results, fields) {
        if (error) {
            res.status(400).json({ 'message': 'Database error', 'description': error });
        } else {
            res.json(results);
        }
    });
};

// REQUEST_BODY: record
exports.saveInstrumentPosition = function (req, res) {
    var lineRecord = req.body.record;

    if (lineRecord) {
        var result = computeFillist.findInRow(lineRecord);
        if (result) {
            async.waterfall([
                function (callback) {
                    mysql.query('select POSITION from fillist where INST_ID = ' + result.id, function (error, dbdata) {
                        callback(error, dbdata);
                    });
                },
                function (dbdata, callback) {
                    var qry = "";
                    if (dbdata.length === 0) {
                        qry = "insert into fillist (INST_ID, POSITION) values (" + result.id + "," + result.position + ");"
                    } else {
                        qry = "update fillist set POSITION = " + (result.position + dbdata[0].POSITION) + " where INST_ID=" + result.id;
                    }
                    mysql.query(qry, function (error, results) {
                        callback(error, results);
                    });
                }
            ], function (error, result) {
                if (error) {
                    res.status(400).json({ 'message': 'Database error', 'description': error });
                } else {
                    res.json((result.affectedRows == 1) ? ({ "message": "Success" }) : ({ "message": "Failed" }));
                }
            });
        } else {
            res.status(400).json({ 'message': 'Invalid request body' });
        }
    } else {
        res.status(400).json({ 'message': 'Invalid request body' });
    }
};

// REQUEST_BODY: file
exports.processFile = function (req, res) {
    try {
        var data = req.file.buffer.toString('utf8');
        var idPosMap = computeFillist.parseFile(data);
        var idList = idPosMap.idList;
        delete idPosMap["idList"];
        if (idList.length > 0) {
            mysql.query('select INST_ID as id, POSITION as position from fillist where INST_ID in (' + idList.toString() + ')', function (error, results, fields) {
                if (error) {
                    res.status(400).json({ 'message': 'Database error', 'description': error });
                } else {
                    var dbList = results;
                    var dbListLength = dbList.length;
                    var dbIdArray = [];

                    var updateQryPartialStr = "";
                    var insertQryPartialStr = "";

                    for (var i = 0; i < dbListLength; i++) {
                        updateQryPartialStr += " when INST_ID = " + dbList[i].id + " then " + (dbList[i].position + idPosMap[dbList[i].id]) + " ";
                        dbIdArray.push(dbList[i].id);
                        delete idPosMap[dbList[i].id];
                    }

                    for (var id in idPosMap) {
                        insertQryPartialStr += "(" + id + "," + idPosMap[id] + "),"
                    }
                    insertQryPartialStr = insertQryPartialStr.substring(0, insertQryPartialStr.length - 1);

                    var updateQuery = "";
                    var insertQuery = "";
                    if (dbListLength > 0) {
                        updateQuery = "update fillist set position = (case" + updateQryPartialStr
                            + "end) where INST_ID in (" + dbIdArray.toString() + ")"
                    }
                    if ((idList.length - dbListLength) > 0) {
                        insertQuery = "insert into fillist (INST_ID, POSITION) values " + insertQryPartialStr;
                    }
                    async.parallel({
                        insertExec: function (callback) {
                            if ((idList.length - dbListLength) > 0) {
                                mysql.query(insertQuery, function (error, results, fields) {
                                    callback(null, results.affectedRows);
                                });
                            } else {
                                callback(null, 0);
                            }
                        },
                        updateExec: function (callback) {
                            if (dbListLength > 0) {
                                mysql.query(updateQuery, function (error, results, fields) {
                                    callback(null, results.affectedRows);
                                });
                            } else {
                                callback(null, 0);
                            }
                        }
                    }, function (err, results) {
                        if (err) {
                            res.json({ "message": "Something went wrong", "description": err });
                        } else {
                            res.json({ "message": "Success", "rowsInserted": results.insertExec, "rowsUpdated": results.updateExec });
                        }
                    });
                }
            });
        } else {
            res.send({ "message": "Data not found in file" });
        }
    } catch (err) {
        res.status(400).json({ "message": "Something went wrong", "description": err });
    }
};

exports.invalidRoutes = function (req, res) {
    res.status(404).json({ "message": "Invalid request" });
};
