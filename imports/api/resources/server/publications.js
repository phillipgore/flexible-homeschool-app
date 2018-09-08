import {Resources} from '../resources.js';

import _ from 'lodash'

Meteor.publish('initialResourceIds', function() {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;
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
				let valueResource = Resources.findOne(query(type, availability), {sort: {title: 1}});

				if (valueResource) {ids['resource' + keyName] = valueResource._id} else {ids['resource' + keyName] = 'empty'};
			})
		});

		let valueFirstResource = Resources.findOne({groupId: groupId, deletedOn: { $exists: false }}, {sort: {title: 1}});
		if (valueFirstResource) {ids['resourceCurrentType'] = valueFirstResource.type} else {ids['resourceCurrentType'] = 'empty'};

		self.added('initialResourceIds', Random.id(), ids);
		self.ready();
	});
});

Meteor.publish('scopedResources', function(type, availability) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

	if (type === 'all' && availability === "all") {
		return Resources.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {title: 1}, fields: {title: 1, type: 1, availability: 1}});
	} else if (type != 'all' && availability != "all") {
		return Resources.find({groupId: groupId, deletedOn: { $exists: false }, type: type, availability: availability}, {sort: {title: 1}, fields: {title: 1, type: 1, availability: 1}});
	} else if (type === 'all' && availability != "all") {
		return Resources.find({groupId: groupId, deletedOn: { $exists: false }, type: { $ne: 'link' }, availability: availability}, {sort: {title: 1}, fields: {title: 1, type: 1, availability: 1}});
	} else if (type != 'all' && availability === "all") {
		return Resources.find({groupId: groupId, deletedOn: { $exists: false }, type: type}, {sort: {title: 1}, fields: {title: 1, type: 1, availability: 1}});
	}
});

Meteor.publish('resource', function(resourceId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Resources.find({groupId: groupId, deletedOn: { $exists: false }, _id: resourceId}, {fields: {groupId: 0, userId: 0, createdOn: 0, updatedOn: 0, deletedOn: 0}});
});

Meteor.publish('searchResources', function( search ) {	
	if ( search ) {
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let regex = new RegExp( search, 'i' );

		let query = {groupId: groupId, deletedOn: { $exists: false }, $or: [ { title: regex }, { author: regex }, { artist: regex }, { director: regex } ]};
		let projection = { limit: 25, sort: { title: 1 }, fields: {title: 1, type: 1} };

		return Resources.find( query, projection );
	}
	return this.ready();
});