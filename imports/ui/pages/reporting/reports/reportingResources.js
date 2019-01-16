import { Template } from 'meteor/templating';
import { Reports } from '../../../../api/reports/reports.js';
import { SchoolWork } from '../../../../api/schoolWork/schoolWork.js';
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




	// School Work Resources
	resources: function() {
		return Resources.find()
	},

	resourceOrigin: function(firstName, lastName) {
		if (firstName || lastName) {
			return true;
		}
		return false;
	},

	resourceIcon: function(resourceType) {
		if (resourceType === 'app') {
			return 'fss-app';
		}
		if (resourceType === 'audio') {
			return 'fss-audio';
		}
		if (resourceType === 'book') {
			return 'fss-book';
		}
		if (resourceType === 'link') {
			return 'fss-link';
		}
		if (resourceType === 'video') {
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

	resourceSchoolWork: function(resourceId) {
		return SchoolWork.find({resources: {$in: [resourceId]}}).map(schoolWork => (schoolWork.name)).join(', ');
	},

	rowVisible: function(cellOne, cellTwo) {
		if (!cellOne && !cellTwo) {
			return 'dis-tn-none';
		}
		return false;
	},

	colSpan: function(cellOne, cellTwo) {
		if (cellOne && cellTwo) {
			return 1;
		}
		return 2;
	},

	sectionVisible: function(cellOne, cellTwo) {
		if (cellOne || cellTwo) {
			return true;
		}
		return false;
	},
});










