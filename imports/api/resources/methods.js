import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Resources} from './resources.js';

Meteor.methods({
	insertResource(resourceProperties) {
		const resourcesId = Resources.insert(resourceProperties);
		return resourcesId
	},

	updateResource: function(resourceId, resourceProperties) {
		Resources.update(resourceId, {$set: resourceProperties});
	},

	archiveResource: function(resourceId) {
		Resources.update(resourceId, {$set: {archive: true}});
	}
})