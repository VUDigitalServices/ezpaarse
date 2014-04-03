'use strict';

/* Directives */

angular.module('ezPAARSE.directives', [])
  .directive('bxslider', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        element.bxSlider({
          mode: 'fade',
          captions: true,
          auto: true,
          adaptiveHeight: true
        });
      }
    };
  })
  .directive('ezGetCurl', function ($location, requestService) {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        scope.getCurl = function () {
          var headers = scope.getHeaders();
          var data    = scope.getData();
          var curl    = 'curl -X POST -u "username:password"';

          for (var key in headers) {
            curl += ' -H "' + key + ':' + headers[key].replace(/"/g, '\\"') + '"';
          }

          if (Array.isArray(data)) {
            var i = 1;
            data.forEach(function (file) {
              curl += ' -F "file' + (i++) + '=@' + file.name + (file.type ? ';type=' + file.type : '') + '"';
            });
          } else {
            curl += ' --data-binary=""';
          }

          curl += ' ' + $location.protocol() + '://';
          curl += $location.host() + ':';
          curl += $location.port();

          scope.curl = curl;
          element.modal('show');
        };
      }
    };
  })
  .directive('popup', function () {
    return {
      restrict: 'AE',
      link: function(scope, element, attributes) {
        element.popup();
      }
    };
  })
  .directive('sidebar', function () {
    return {
      restrict: 'E',
      link: function(scope, element, attributes) {
        element.sidebar({ overlay: true });

        var attach = attributes['ezAttachedTo'];
        if (attach) { element.sidebar('attach events', attach, 'toggle'); }
      }
    };
  })
  .directive('modal', function () {
    return {
      restrict: 'E',
      link: function(scope, element, attributes) {
        var attach = attributes['ezAttachedTo']

        if (attach) {
          element.modal('attach events', attach, 'toggle');
        }
      }
    };
  })
  .directive('ezTriggerClick', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        $(element).click(function () {
          $(attributes['ezTriggerClick']).click();
        });
      }
    };
  })
  .directive('ezFileDrop', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        var elem   = $(element);
        var fn     = attributes['ezFileDrop'];
        var dimmer = elem.find('.ui.dimmer');

        var preventDefault = function (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        var dimmed = function () {
          elem.addClass('over');
          dimmer.addClass('active');
        }
        var undimmed = function () {
          elem.removeClass('over');
          dimmer.removeClass('active');
        }

        elem.on('dragenter', function (e) {
          preventDefault(e);
          dimmed();
        });
        dimmer.on('dragover', function (e) {
          preventDefault(e);
        });
        dimmer.on('dragleave', function (e) {
          preventDefault(e);
          undimmed();
        });
        dimmer.on('drop', function (e) {
          preventDefault(e);
          undimmed();

          var files = e.originalEvent.dataTransfer.files;
          if (typeof scope[fn] == 'function') { scope[fn].call(this, files); }
        });
      }
    };
  })
  .directive('form', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attributes) {
        element.submit(function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
      }
    };
  })
  .directive('accordion', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attributes) {
        element.accordion();
      }
    };
  })
  .directive('ezCheckbox', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attributes) {
        element.checkbox();
      }
    };
  })
  .directive('ezChosen', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        $(element).chosen({ allow_single_deselect: true });
      }
    };
  });