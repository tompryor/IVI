/**
 * Mixin for replacing managed content
 *
 * @mixin esWidget/content/_ContentMixin
 */
define(["dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/string",
	"dojo/topic",
	"dojo/query",
	"dojo/json",
	"dijit/registry",
	"esLang/log"], function (declare, array, lang, domAttr, _string, topic, query, json, registry, log) {
	"use strict";

	return declare(null, {

		contentList : null,

		_contentMap : null,
		_typedContentMap : null,
		_isMapped : false,

		/**
		 * Replaces any managed content for a domNode
		 *
		 * @memberof esWidget/content/_ContentMixin#
		 * @param {object}
		 *		node The dom node for which to replace content.
		 * @param {string}
		 *		type Optional parameter. Used to specify the content grouping from which to retrieve the content.
		 */
		replaceContent : function (node, type) {

			// Prevent replacement on a null node. By default this will perform
			// replacement on all scenes in the entire DOM which is not desirable.
			if (node === null) {
				log.error("EWDGT003");
				throw "Content.replace: node argument cannot be null";
			}

			/**
			 * Find all of the nodes that need content replacement and populate 
			 * with content. This replaces the innerHTML of any node with a data-contentKey
			 * attribute with the value of the required content.
			 * @param [i]
			 */
			query("[data-contentKey]", node).forEach(function (entry) {
				var contentKeys, keys;

				// Get the node and its content key
				contentKeys = domAttr.get(entry, "data-contentKey");
				contentKeys = contentKeys.replace(/\s/g, ""); // remove spaces

				// Break the content key attribute into multiple keys, if present
				keys = contentKeys.split(",");

				// Process each key
				array.forEach(keys, function (key) {
					var keyParts, contentKey, attribute, contentField, contentItem = null, prefix, suffix;

					// Get the attribute if present (in the form content_key|attribute|content_field)
					// attribute defaults to innerHTML, content_field defaults to label
					keyParts = key.split("|");
					contentKey = keyParts[0];
					attribute = keyParts[1] || "innerHTML";
					contentField = keyParts[2] || "label";
					prefix = keyParts[3] || "";
					suffix = keyParts[4] || "";

					// Get the content item
					if (contentKey) {
						contentItem = this.getContentItem(contentKey, type);

						if (contentItem) {
							this._substitute(contentItem, entry, attribute, contentField, prefix, suffix);
						}
					}
				}, this);

				// Clean up the data-contentKey and data-contentDataList attributes as they are no longer needed
				domAttr.remove(entry, "data-contentKey");
				domAttr.remove(entry, "data-contentDataList");

			}, this);

		},

		/**
		 * Retrieve a specific content item from the result of the content call. Note that the retrieve() method 
		 * must be called prior to calling this method.
		 *
		 * @memberof esWidget/content/_ContentMixin#
		 * @param {string}
		 *		contentKey The key used to look up the content item.
		 * @param {boolean}
		 *		ignoreError  Boolean value used to determine if the missing contentKey should be logged or not
		 * @returns {object} A content object if found; otherwise, null.
		 */
		getContentItem : function (contentKey, ignoreError) {
			var item = null;

			if (!this._isMapped) {
				this._loadContentMap();
			}
			item = this._contentMap[contentKey];

			if (!item && !ignoreError) {
				log.error("EWDGT004", contentKey);
			}

			return item;
		},

		/**
		 * Retrieve a specific attribute from the content item with the given contentKey.
		 *
		 * @memberof esWidget/content/_ContentMixin#
		 * @param {string}
		 *		contentKey The key used to look up the content item.
		 * @param {string}
		 *		attr The attribute to pull from the contentItem (label, url, value, etc.)
		 * @param {string}
		 *		defaultReturnValue Optional parameter used if the content key does not exist or have the given attribute		 
		 * @param {boolean}
		 *		ignoreError  Boolean value used to determine if the missing contentKey should be logged or not
		 * @param {object}
		 *		replacementValues  Array or map containing values to be used for substitution 
		 * @returns {string} The value of the specified attribute or the given defaultLabel if item missing. 
		 *		If no default label, return the empty string
		 */
		getContentItemAttr : function (contentKey, attr, defaultReturnValue, ignoreError, /* Array or Map */replacementValues) {
			var item = this.getContentItem(contentKey, ignoreError);

			if (item && item[attr]) {
				return this._substituteValues(item[attr], replacementValues);
			} else if (defaultReturnValue) {
				return this._substituteValues(defaultReturnValue, replacementValues);
			} else {
				return "Error finding " + attr + " for key " + contentKey;
			}
		},

		/**
		 * Retrieve the label for the content item with the given contentKey.
		 *
		 * @memberof esWidget/content/_ContentMixin#
		 * @param {string}
		 *		contentKey The key used to look up the content item.
		 * @param {string}
		 *		defaultLabel Optional parameter used if the content key does not exist		 
		 * @param {object}
		 *		replacementValues  Array or map containing values to be used for substitution 
		 * @returns {string} The value of the label or the given defaultLabel if item missing. 
		 *		If no default label, return the empty string
		 */
		getContentItemLabel : function (contentKey, defaultLabel, replacementValues) {
			return this.getContentItemAttr(contentKey, "label", defaultLabel, false, replacementValues);
		},

		/**
		 * Retrieve a grouping of content based on the content type. Note that the
		 * retrieve() method must be called prior to calling this method.
		 * 
		 * @memberof esWidget/content/_ContentMixin#
		 * @param {string}
		 *		contentGroupKey The key used to look up the content group.
		 * @returns {array} An array of content objects if found; otherwise, null.
		 */
		getContentGroup : function (contentGroupKey) {
			var group = null;

			if (!this._isMapped) {
				this._loadContentMap();
			}
			group = this._typedContentMap[contentGroupKey];

			return group;
		},

		/**
		 * Retrieve a label for the content item with the given contentKey.
		 *
		 * @memberof esWidget/content/_ContentMixin#
		 * @param {string}
		 *		contentKey The key used to look up the content item.
		 * @param {string}
		 *		defaultLabel Optional parameter used if the content key does not exist or have the given attribute		 
		 * @param {string}
		 *		jurisdiction  Optional parameter two letter state abbreviation code
		 * @param {object}
		 *		replacementValues  Array or map containing values to be used for substitution 
		 * @returns {string} The label for this content item with jurisdiction (foo_key_pa) or the content item (foo_key), 
		 *		or the given defaultLabel if item missing.  If no default label, return the empty string
		 */
		getContentItemLabelWithJurisdiction : function (contentKey, defaultLabel, jurisdiction, replacementValues) {
			var result = this.getContentItem(contentKey + "_" + jurisdiction.toLowerCase(), true);
			if (!result) {
				result = this.getContentItemAttr(contentKey, "label", defaultLabel, true, replacementValues);
			} else {
				result = this._substituteValues(result.label, replacementValues);
			}
			return result;
		},

		/**
		 * Changes the given content item by replacing the first string with the second string.
		 *
		 * @memberof esWidget/content/_ContentMixin#
		 * @param {string}
		 *		contentKey The key used to look up the content item.
		 * @param {string}
		 *		keyToReplace The string to look for	 
		 * @param {string}
		 *		replacementString  The string to put in
		 */
		replaceWithinKey : function (contentKey, keyToReplace, replacementString) {
			var i;

			// first update the content item
			for (i in this.contentList) {
				if (typeof (this.contentList[i]) !== "function") {
					if (this.contentList[i].contentKey === contentKey) {
						if (this.contentList[i].label) {
							this.contentList[i].label = this.contentList[i].label.replace(keyToReplace, replacementString);
						}
						if (this.contentList[i].value) {
							this.contentList[i].value = this.contentList[i].value.replace(keyToReplace, replacementString);
						}
					}
				}
			}

			// force rebuilding of the maps on next call
			this._isMapped = false;
		},

		/**
		 * Performs parameterized substitutions on a string
		 *
		 * @memberof esWidget/content/_ContentMixin#
		 * @private
		 * @param {string}
		 *		contentString String containing parameters to be substituted
		 * @param {object}
		 *		replacementValues  Array or map containing values to be used for substitution 
		 * @returns {string} The content string is returned with substituted values
		 */
		_substituteValues : function (contentString, replacementValues) {
			if (contentString.indexOf("${") !== -1) {
				if (typeof replacementValues === "object") {
					try {
						contentString = _string.substitute(contentString, replacementValues);
					} catch (e) {
						// The string substitution above throws a TypeError if the replacementValues
						// object does not contain all replacement values found in the contentString.
						// Handle the error here to prevent the current application from failing.
						// If this happens, the content string will be returned without any values being
						// substituted
						log.error("EWDGT005", "string: '" + contentString + "' replacement values: " + json.stringify(replacementValues));
					}
				}
			}
			return contentString;
		},

		_substitute : function (content, node, attribute, contentField, prefix, suffix) {
			var widgetId, value = content[contentField] || "";

			value = prefix + value + suffix;

			// If innerHTML specified, replace the entire node contents
			if (attribute === "innerHTML") {
				node.innerHTML = value;
			}
			// Otherwise perform attribute substitution
			else {
				widgetId = domAttr.get(node, "widgetId");

				// See if it is a widget
				if (widgetId) {
					registry.byId(widgetId)[attribute] = value;
				}
				// Otherwise treat as a DOM node
				else {
					domAttr.set(node, attribute, value);
				}
			}
		},

		_loadContentMap : function () {
			var content, key, type, i;

			this._contentMap = [];
			this._typedContentMap = [];
			// For each item in the response, add it to the page content list
			for (i in this.contentList) {
				if (typeof (this.contentList[i]) !== "function") {
					// create an item with the label and value
					content = {
						contentKey : this.contentList[i].contentKey,
						label : this.contentList[i].label,
						value : this.contentList[i].value,
						url : this.contentList[i].url,
						imageUrl : this.contentList[i].imageUrl,
						mediaUrl : this.contentList[i].mediaUrl,
						target : this.contentList[i].target
					};

					// create the key for the item and grab the type
					key = this.contentList[i].contentKey;
					type = this.contentList[i].type;

					// Add the content to the flat hash of all content
					this._contentMap[key] = content;

					// Create the type index if necessary
					if (!this._typedContentMap[type]) {
						this._typedContentMap[type] = {};
					}

					// Add the content to the type-indexed hash of content
					this._typedContentMap[type][key] = content;
				}
			}
			this._isMapped = true;
		}

	});
});
