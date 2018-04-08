import { Template } from 'meteor/templating';
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

	subjects: function(selectedSchoolYearId, selectedStudentId) {
		return Subjects.find({schoolYearId: selectedSchoolYearId, studentId: selectedStudentId})
	},




	// Selections
	selectedSchoolYear: function() {
		return Session.get('selectedSchoolYear');
	},

	selectedStudent: function() {
		return Session.get('selectedStudent');
	},




	// Subject Resources
	resources: function(selectedSchoolYearId, selectedStudentId) {
		let resourceIds = _.flatten( Subjects.find({schoolYearId: selectedSchoolYearId, studentId: selectedStudentId}).map(subject => (subject.resources)) );
		return Resources.find({_id: {$in: resourceIds}})
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










