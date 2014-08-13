var fs = require('fs'),
  path = require('path');

var cheerio = require('cheerio'),
  async = require('async'),
  glob = require('glob'),
  mkdirp = require('mkdirp');


var setting = {
  configPath: './',
  jsonPath: 'static-indexer.json',
  pattern: '**/*.html'
};


function getTitle (file) {
  var $ = cheerio.load(fs.readFileSync(file));

  return $('title').text();
}

function getFileUrl (root, file) {
  var relativePath = path.relative(root, file);

  return relativePath.replace(/\\/g, '/');
}


module.exports = function (root, args, cb) {

  var rootPath = root || process.cwd(),
    files = glob.sync(rootPath + '/' + setting.pattern),
    outputPath = args ? (args.o || args.output) : null,
    callback = cb || function () {};

  async.series({
    indexList: function (next) {
      var indexList = [];

      files.forEach(function (file) {
        var fileTitle = getTitle(file),
          filePath = getFileUrl(rootPath, file);

        indexList.push({
          title: fileTitle.length ? fileTitle : filePath,
          path: filePath,
          stat: fs.statSync(file)
        });
      });

      next(null, indexList);
    },
    jsonPath: function (next) {
      var jsonPath = outputPath || path.join(setting.configPath, setting.jsonPath),
        jsonDir = outputPath ? path.dirname(outputPath) : setting.configPath;

      fs.exists(jsonPath, function (exists) {
        if (exists) {
          next(null, jsonPath);
        } else {
          mkdirp(jsonDir, function (err) {
            if (err) {
              throw err;
            }
            next(null, jsonPath);
          });
        }
      });
    }
  }, function (err, result) {
    if (err) {
      throw err;
    }

    var jsonData = JSON.stringify(result.indexList, null, 4);

    fs.writeFile(result.jsonPath, jsonData, function (err) {
      if (err) {
        throw err;
      }
      callback(err, result.jsonPath, result.indexList);
    });
  });
};
