#!/usr/bin/env node

// ##EZPAARSE

/*jslint node: true, maxlen: 150, maxerr: 50, indent: 2 */
'use strict';
var byline = require('byline');
var URL = require('url');
var querystring = require('querystring');

function parseUrl(url) {
  var result = {};
  var param = querystring.parse(URL.parse(url).query);
  
  var match;
  if ((match = /\/Document/.exec(url)) !== null) {
    if (param['produit-id']) {
      result.pid = param['produit-id'];
      result.unitid = param['produit-id'];
    }
    if (param['famille-id']) {
      switch (param['famille-id']) {
      case 'REVUES':
      // example : http://www.dalloz.fr/Document?produit-id=REVTRAV&famille-id=REVUES
        result.rtype = 'TOC';
        result.mime = 'MISC';
        break;
      case 'ENCYCLOPEDIES':
      // example : http://www.dalloz.fr/Document?produit-id=IMMO&famille-id=ENCYCLOPEDIES
        result.rtype = 'ENCYCLOPEDIES';
        result.mime = 'MISC';
        break;
      case 'CODES':
      // example : http://www.dalloz.fr/Document?produit-id=CCIV&famille-id=CODES
        result.rtype = 'CODES';
        result.mime = 'MISC';
        break;
      case 'FORMULES':
      // example : http://www.dalloz.fr.bases-doc.univ-lorraine.fr/Document?produit-id=FORMPCIV&famille-id=FORMULES
        result.rtype = 'FORMULES';
        result.mime = 'MISC';
        break;
      case 'BROCHES':
      // example : http://www.dalloz.fr.bases-doc.univ-lorraine.fr/Document?produit-id=DRCONTRAFF&famille-id=BROCHES
        result.rtype = 'BROCHES';
        result.mime = 'MISC';
        break;
        /** ces cas rencontrés ne sont peut etre pas traités
      case 'JURIS':
        result.type = 'JURIS';
        break;
      case 'FORMPCIV':
        result.type = 'FORMPCIV';
        break;
        **/
      }
    }
  }

  return result;
}

/*
* If an array of urls is given, return an array of results
* Otherwise, read stdin and write into stdout
*/
exports.parserExecute = function (urls) {

  if (urls && Array.isArray(urls)) {
    var results = [];
    for (var i = 0, l = urls.length; i < l; i++) {
      results.push(parseUrl(urls[i]));
    }
    return results;
  } else {
    var stdin = process.stdin;
    var stdout = process.stdout;
    var stream = byline.createStream(stdin);

    stream.on('end', function () {
      process.exit(0);
    });

    stream.on('close  ', function () {
      process.exit(0);
    });

    stream.on('data', function (line) {
      stdout.write(JSON.stringify(parseUrl(line)) + '\n');
    });
  }
};

if (!module.parent) {
  var optimist = require('optimist')
    .usage('Parse URLs read from standard input. ' +
      'You can either use pipes or enter URLs manually.' +
      '\n  Usage: $0' +
      '\n  Example: cat urls.txt | $0');
  var argv = optimist.argv;

  // show usage if --help option is used
  if (argv.help || argv.h) {
    optimist.showHelp();
    process.exit(0);
  }

  exports.parserExecute();
}
