
var dataMap = {};
var idList = [];

function createMap(id, position) {
    if(dataMap.hasOwnProperty(id)){
        dataMap[id] += position;
    } else {
        dataMap[id] = position;
        idList.push(id);
    }
}

module.exports.parseFile = function(data) {
    var masterArray = data.split("\n");
    var len = masterArray.length;
    dataMap = {};
    idList = [];

    for(var i=0; i<len; i++) {
        var obj = module.exports.findInRow(masterArray[i]);
        if(obj != undefined) {
            createMap(obj.id, obj.position);
        }
    }
    dataMap.idList = idList;
    return dataMap;
}
module.exports.findInRow = function(row) {
    var indexOf54Key = row.indexOf("|54=") + 4;
    var _54Val = parseInt(row.charAt(indexOf54Key));

    var indexOf48Key = row.indexOf("|48=") + 4;
    var indexOf48NextPipe = indexOf48Key + row.substring(indexOf48Key).indexOf("|");
    var _48Val = parseInt(row.substring(indexOf48Key,indexOf48NextPipe));

    var indexOf32Key = row.indexOf("|32=") + 4;
    var indexOf32NextPipe = indexOf32Key + row.substring(indexOf32Key).indexOf("|");
    var _32Val = parseInt(row.substring(indexOf32Key,indexOf32NextPipe));

    if(indexOf54Key === 3 || indexOf48Key === 3 || indexOf32Key === 3){
        return undefined;
    } else {
        return ({"id": _48Val, "position": _32Val * ((_54Val === 1)?1:(_54Val === 2)?-1:0)});
    }
}