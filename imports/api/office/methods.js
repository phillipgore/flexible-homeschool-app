import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Groups} from '../groups/groups.js';

import _ from 'lodash'

Meteor.methods({
	getAccountStats(groupId) {
		if (!this.userId) {
			return false;
		}

		return groupId
	}
});