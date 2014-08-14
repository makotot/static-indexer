#!/usr/bin/env node

var indexer = require('./');

var argv = require('minimist')(process.argv.slice(2));


function help () {
  console.log([
    '',
    '  Usage:',
    '  $ static-indexer [<target dir>]',
    '',
    '  option:',
    '  --help	Show this message.',
    '  --o, --output <path>	Specify output file.',
    ''
  ].join('\n'));
}


if (argv.help) {
  help();
  process.exit(0);
}

indexer(argv._[0], argv, function (err, jsonPath, index) {
  if (err) {
    throw err;
  }

  console.log([
    '  ' + jsonPath + ' is successfully created.',
    '  ' + index.length + ((index.length > 2) ? ' pages are ' : ' page is ') + 'indexed.',
    ''
  ].join('\n'));
});
