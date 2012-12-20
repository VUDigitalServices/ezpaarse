#!/usr/bin/env python

import sys
import urlparse
import string
import re
import json

for line in sys.stdin:
  result = {}
  url = urlparse.urlparse(line)
  param = urlparse.parse_qs(url.query)
  if param.has_key('_ob'):
    if param.has_key('_cdi'):
      result['cdi'] = param['_cdi'][0]
    
    ob = param['_ob'][0]
    if ob == 'IssueURL':
      # sommaire
      arg = string.split(param['_tockey'][0], "#");
      # l'identifiant est le 2 param du _tockey separe par des
      result['cdi'] = arg[2]
      result['type'] = 'TOC'
    else:
      if ob == 'ArticleURL':
        # resume ou full text
        if param.has_key('_fmt'):
          fmt = param['_fmt'][0]
          if fmt == 'summary':
            result['type'] = 'SUMMARY';
          else:
            if fmt == 'full':
              result['type'] = 'TXT';
      else:
        if ob == 'MImg':
          result['type'] = 'PDF'
        else:
          if ob == 'MiamiImageURL':
            if param.has_key('_pii'):
              pii = param['_pii'][0]
              result['issn'] = "%s-%s" % (pii[1:5], pii[5:9])
              result['type'] = 'PDF'
          else:
            if ob == 'DocumentDeliveryURL':
              result['type'] = 'ORDER'
            else:
              result['qualification'] = False
  else:
    match = re.search("\/science\/article\/pii\/S([0-9]{4})([0-9]{3}[0-9Xx])", line)
    if match is not None:
      groups = match.groups()
      result['issn'] = "%s-%s" % (groups[0], groups[1])
      result['type'] = 'TXT'
  print json.dumps(result, separators=(',',':'))