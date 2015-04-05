// framework/specialTags/DataModel.js
// ------------------

/**
 * Tentative API:
 *
 * var DataModel = fw.dataModel({
 *   id: 'id',
 *
 *   // string based url with automatic RESTful routes
 *   url: 'http://server.com/person',
 *
 *   // custom routes provided by callback
 *   url: function(method) {
 *     switch(method) {
 *       case 'read':
 *         return 'http://server.com/person/:id';
 *         break;
 *
 *       case 'create':
 *         return 'http://server.com/person';
 *         break;
 *
 *       case 'update':
 *         return 'http://server.com/person/:id';
 *         break;
 *
 *       case 'delete':
 *         return 'http://server.com/person/:id';
 *         break;
 *     }
 *   },
 *
 *   initialize: function() {
 *     // field declarations and mapping
 *     this.firstName = fw.observable().mapTo('firstName');
 *     this.lastName = fw.observable().mapTo('lastName');
 *     this.movieCollection = {
 *       action: fw.observable().mapTo('movies.action'),
 *       drama: fw.observable().mapTo('movies.drama'),
 *       comedy: fw.observable().mapTo('movies.comedy'),
 *       horror: fw.observable().mapTo('movies.horror')
 *     };
 *
 *     // model operations
 *     this.$fetch(); // GET
 *     this.$save(); // PUT / POST
 *     this.$destroy(); // DELETE
 *     this.$load({}); // load data into model
 *     this.$toJS(); // return current data in POJO form
 *     this.$toJSON(); // return current data in JSON form
 *   }
 * });
 */

var DataModel = function(descriptor, configParams) {
  return {
    _preInit: function( params ) {
    },
    mixin: {
      $$tracked: {}, // internal tracking/mapping/etc data
      $fetch: function() {}, // GET
      $save: function() {}, // PUT / POST
      $destroy: function() {}, // DELETE
      $load: function(/* { ... } */) {}, // load data into model
      $toJS: function() {}, // return current data in POJO form
      $toJSON: function() {} // return current data in JSON form
    },
    _postInit: function() {
    }
  };
};
