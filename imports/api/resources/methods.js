import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Resources} from './resources.js';

Meteor.methods({
	insertResource(resourceProperties) {
		const resourcesView = Resources.insert(resourceProperties);
		return resourcesView
	},

	updateResource: function(resourceId, resourceProperties) {
		Resources.update(resourceId, {$set: resourceProperties});
	},

	deleteResource: function(resourceId) {
		Resources.update(resourceId, {$set: {deletedOn: new Date()}});
	}
})