// framework/collection/exports.js
// ------------------

/**
 * Example/Tentative Usage:
 *
 * var Car = fw.dataModel({
 *   // ...
 * });
 *
 * var Garage = fw.collection({
 *   namespace: 'Garage',
 *   url: '/some/rest/endpoint',
 *
 *   // one of these
 *   viewModel: Car,
 *   dataModel: Car,
 * });
 *
 * var cars = new Garage([{ make: 'Ford' }, { make: 'BMW' }]);
 */

fw.collection = function(conf) {
  return function initCollection(collectionData) {
    var collection = fw.observableArray();

    var config = extend({}, defaultCollectionConfig, conf);
    collection.__getConfigParams = function() {
      return config;
    };

    extend(collection, {
      $namespace: fw.namespace(config.namespace || uniqueId('collection')),
      $sync: function() {
        return fw.sync.apply(this, arguments);
      },
      $set: function() { console.info('TODO', '$set'); },
      $reset: function() { console.info('TODO', '$reset'); },
      $fetch: function(options) {
        options = options ? clone(options) : {};

        if(isUndefined(options.parse)) {
          options.parse = true;
        }

        var xhr = this.$sync('read', this, options);

        var collection = this;
        xhr.done(function(resp) {
          var method = options.reset ? '$reset' : '$set';
          collection[method](resp, options);
          collection.$namespace.publish('sync', collection, resp, options);
        });

        return xhr;
      },
      __isCollection: true,
      __originalData: collectionData
    });

    return collection;
  };
};
