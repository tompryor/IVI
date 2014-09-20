/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Collections = LibertyMutualIVIBaseApp.Collections || {};

/**
 * A collection is just a list of models and even more.
 * It contains a bunch of helper functions, sync logic
 * and events.
 *
 * For further information go to:
 * http://the-m-project.org/docs/absinthe/Collection.html
 * http://backbonejs.org/#Collection
 */

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Collections.UsersCollection = M.Collection.extend({
        
        model: LibertyMutualIVIBaseApp.Models.UsersModel
        
    });

})();
