import {Terms} from '../terms.js';
import {Stats} from '../../stats/stats.js';
import {Paths} from '../../paths/paths.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Weeks} from '../../weeks/weeks.js';
import {Lessons} from '../../lessons/lessons.js';
import {studentTermStatusAndPaths} from '../../../modules/server/functions';
import _ from 'lodash'

Meteor.publish('allTerms', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Terms.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}});
});

Meteor.publish('schoolYearTerms', function(schoolYearId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Terms.find({schoolYearId: schoolYearId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}});
});




