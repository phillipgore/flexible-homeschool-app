import { Template } from 'meteor/templating';
import { Reports } from '../../../../api/reports/reports.js';
import { Subjects } from '../../../../api/subjects/subjects.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import { Lessons } from '../../../../api/lessons/lessons.js';
import { Resources } from '../../../../api/resources/resources.js';

import {minutesConvert} from '../../../../modules/functions';
import _ from 'lodash'
import './reportingResources.html';

Template.reportingResources.helpers({
	user: function() {
		return Meteor.users.findOne();
	},

	report: function() {
		return Reports.findOne({_id: FlowRouter.getParam('selectedReportId')})
	},




	// Selections
	selectedSchoolYear: function() {
		return SchoolYears.find({_id: Session.get('selectedSchoolYearId')})
	},

	selectedStudent: function() {
		return Students.find({_id: Session.get('selectedStudentId')})
	},




	// Subject Resources
	resources: function() {
		return Resources.find()
	},

	resourceOrigin: function(firstName, lastName) {
		if (firstName || lastName) {
			return true;
		}
		return false;
	},

	resourceIcon: function(resource) {
		if (resource === 'app') {
			return 'fss-app';
		}
		if (resource === 'audio') {
			return 'fss-audio';
		}
		if (resource === 'book') {
			return 'fss-book';
		}
		if (resource === 'link') {
			return 'fss-link';
		}
		if (resource === 'video') {
			return 'fss-video';
		}
	},

	availabilityStatment: function(availability) {
		if (availability === 'own') {
			return 'I have it.'
		}
		if (availability === 'borrowed') {
			return 'I borrowed it.'
		}
		return 'I need it.'
	},

	resourceSubjects: function(resourceId) {
		return Subjects.find({resources: {$in: [resourceId]}}).map(subject => (subject.name)).join(', ');
	},
});










