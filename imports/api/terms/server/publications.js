import {Terms} from '../terms.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Weeks} from '../../weeks/weeks.js';
import {Lessons} from '../../lessons/lessons.js';
import {allTermStatusAndPaths} from '../../../modules/server/functions';
import {studentTermStatusAndPaths} from '../../../modules/server/functions';
import _ from 'lodash'

Meteor.publish('allTerms', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Terms.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}});
});

Meteor.publish('allTermsPath', function(schoolYearId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		SchoolYears.find();
		Weeks.find();
		Lessons.find();

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let terms = Terms.find({schoolYearId: schoolYearId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}});

		terms.map((term) => {
			term = allTermStatusAndPaths(term, term._id, schoolYearId);
			self.added('terms', term._id, term);
		});

		self.ready();
	});
});

Meteor.publish('studentTermsPath', function(schoolYearId, studentId, showAllTerms) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let terms = Terms.find({schoolYearId: schoolYearId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}});
		let termStatus = []

		terms.map((term) => {
			term = studentTermStatusAndPaths(term, term._id, schoolYearId, studentId);
			termStatus.push(term.status)
			self.added('terms', term._id, term);
		});
		
		function getStatus(status) {
			if (_.includes(status, 'partial')) {
				return'partial';
			}
			if (_.includes(status, 'completed') && !_.includes(status, 'empty') && !_.includes(status, 'pending')) {
				return 'completed';
			}
			if (_.includes(status, 'empty') && !_.includes(status, 'completed') && !_.includes(status, 'pending')) {
				return 'empty';
			}
			if (_.includes(status, 'pending') && !_.includes(status, 'empty') && !_.includes(status, 'completed')) {
				return 'pending';
			}
		}

		if (showAllTerms && terms.count()) {
			let allTerms = {order: 0, schoolYearId: schoolYearId, status: getStatus(termStatus), firstWeekId: 'empty'}
			self.added('terms', 'allTerms', allTerms);
		}

		self.ready();
	});
});




