/*global LibertyMutualIVIBaseApp, Backbone, JST*/

LibertyMutualIVIBaseApp.Layouts = LibertyMutualIVIBaseApp.Layouts || {};

/**
 * A layout provides an easy way to switch between different
 * views with similar or different content.
 *
 * For further information go to:
 * http://the-m-project.org/docs/absinthe/Layout.html
 */

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Layouts.TermsAndConditionsLayout = M.Layout.extend({
		//el: $(".m-perspective"),
		
		template: '<div></div>',
		
		childViews: {},
		
		applyViews: function(settings) {
			
			this.$el.html(settings.content.render().$el);
			
			return this;
		},

		_attachToDom: function() {
		    return YES;
		},
		
		
		setTransition: function( name ) {
		    M.PageTransitions.setTransition( M.PageTransitions.NONE );
		},
		
		startTransition: function() {
		    M.PageTransitions.startTransition();
		},
		
		destroy: function() {
		    this.$el.remove();
		    this.$el = null;
		    this.childViews = null;
		    M.PageTransitions.reset();
		}
    });

})();
