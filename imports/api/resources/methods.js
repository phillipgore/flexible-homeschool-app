import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Resources} from './resources.js';
import _ from 'lodash'

Meteor.methods({
	getInitialResourceIds() {
		if (!this.userId) {
			return false;
		}

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let ids = {};

		let resourceTypes = ['all', 'book', 'link', 'video', 'audio', 'app'];
		let resourceAvailabilities = ['all', 'own', 'borrowed', 'need'];

		resourceTypes.forEach((type) => {
			resourceAvailabilities.forEach((availability) => {
				function query (type, availability) {
					if (type === 'all' && availability === 'all') {
						return {groupId: groupId, deletedOn: { $exists: false }};
					}
					if (type === 'all' && availability != 'all') {
						return {availability: availability, groupId: groupId, deletedOn: { $exists: false }};
					}
					if (type != 'all' && availability === 'all') {
						return {type: type, groupId: groupId, deletedOn: { $exists: false }};
					}
					return {type: type, availability: availability, groupId: groupId, deletedOn: { $exists: false }};
				};

				let keyName = _.capitalize(type) + _.capitalize(availability);
				let valueResource = Resources.findOne(query(type, availability), {sort: {title: 1}, fields: {_id: 1}});

				if (valueResource) {ids['resource' + keyName] = valueResource._id} else {ids['resource' + keyName] = 'empty'};
			})
		});

		let valueFirstResource = Resources.findOne({groupId: groupId, deletedOn: { $exists: false }}, {sort: {title: 1}, fields: {type: 1}});
		if (valueFirstResource) {ids['resourceCurrentType'] = valueFirstResource.type} else {ids['resourceCurrentType'] = 'empty'};

		return ids;
	},

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