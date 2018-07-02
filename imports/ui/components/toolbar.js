import {Template} from 'meteor/templating';
import { Students } from '../../api/students/students.js';
import './toolbar.html';

import _ from 'lodash'

Template.toolbar.helpers({
	selectedFramePosition: function() {
		return Session.get('selectedFramePosition');
	},
	
	logo: function() {
		if(Meteor.userId() && Meteor.user().status.active) {
			return false;
		}
		return true;
	},

	backButton: function() {
		let windowWidth = Session.get('windowWidth');
		let type = Session.get('toolbarType');
		if (type === 'new' || type === 'edit') {
			return false;
		}
		if (windowWidth <= 768 && Session.get('selectedFramePosition') === 3) {
			return true;
		}
		if (windowWidth <= 480 && Session.get('selectedFramePosition') === 2) {
			return true;
		}
		return false;
	},

	labelOne() {
		return Session.get('labelOne');
	},

	labelTwo() {
		return Session.get('labelTwo');
	},

	labelThree() {
		return Session.get('labelThree');
	},

	newUrl: function() {
		return Session.get('newUrl');
	},

	newable: function() {
		let type = Session.get('toolbarType');
		if (type === 'tracking' || type === 'billing' || type === 'support' || type === 'new' || type === 'edit') {
			return false;
		}
		if (Session.get('selectedFramePosition') === 1 && type === 'report') {
			return true;
		}
		if (Session.get('selectedFramePosition') === 2 && type != 'report' && type != 'resource') {
			return true;
		}
		return false;
	},

	resourceNewable: function() {
		let type = Session.get('toolbarType');
		if (type === 'new' || type === 'edit') {
			return false;
		}
		if (Session.get('selectedFramePosition') === 2 && Session.get('toolbarType') === 'resource') {
			return true;
		}
		return false;
	},

	actionable() {
		let type = Session.get('toolbarType');
		if (type === 'new' || type === 'edit') {
			return false;
		}
		if (Session.get('selectedFramePosition') === 2 && Session.get('toolbarType') === 'report') {
			return true;
		}
		if (Session.get('selectedFramePosition') === 3 && Session.get('toolbarType') != 'tracking') {
			return true;
		}
		return false;
	},

	subjectDisabled: function() {
		if (!Counts.get('studentCount') || !Counts.get('schoolYearCount')) {
			return true;
		}
		return false;
	},

	selectedResourceType: function() {
		return Session.get('selectedResourceType');
	},

	selectedResourceAvailability: function() {
		return Session.get('selectedResourceAvailability');
	},

	selectedStudentId: function() {
		return Session.get('selectedStudentId');
	},

	selectedSchoolYearId: function() {
		return Session.get('selectedSchoolYearId');
	},

	editUrl: function() {
		return Session.get('editUrl');
	},

	editableDeletable: function() {
		if (Counts.get(Session.get('toolbarType') + 'Count')) {
			return true;
		}
		return false;
	},

	deletable: function() {
		let type = Session.get('toolbarType');
		if (type === 'user') {
			let verified = $('.js-user .active').attr('data-verified');
			let active = $('.js-user .active').attr('data-active');

			if (active && !verified) {
				return true;
			}
			return false;
		}
		if (type === 'tracking' || type === 'billing' || type === 'support' || type === 'new' || type === 'edit') {
			return false;
		}
		return true;
	},

	deleteClass: function() {
		return 'js-delete-' + Session.get('toolbarType');
	},

	equal: function(itemOne, itemTwo) {
		if (itemOne === itemTwo) {
			return true;
		}
		return false;
	},
});

Template.toolbar.events({
	'click .js-new-subject'(event) {
		event.preventDefault();

		if (!$(event.currentTarget).hasClass('disabled')) {
			FlowRouter.go($(event.currentTarget).attr('href'));
		}
	},

	'click .js-delete-student'(event) {
		event.preventDefault();

		Dialogs.insert({
			heading: 'Confirmation',
			message: 'Are you sure you want to delete this Student?',
			confirmClass: 'js-delete-student-confirmed',
		});
	},

	'click .js-delete-schoolYear'(event) {
		event.preventDefault();

		Dialogs.insert({
			heading: 'Confirmation',
			message: 'Are you sure you want to delete this School Year?',
			confirmClass: 'js-delete-school-year-confirmed',
		});
	},
	
	'click .js-delete-resource'(event) {
		event.preventDefault();

		Dialogs.insert({
			heading: 'Confirmation',
			message: 'Are you sure you want to delete this Resource?',
			confirmClass: 'js-delete-resource-confirmed',
		});
	},

	'click .js-delete-subject'(event) {
		event.preventDefault();

		Dialogs.insert({
			heading: 'Confirmation',
			message: 'Are you sure you want to delete this Subject?',
			confirmClass: 'js-delete-subject-confirmed',
		});
	},

	'click .js-delete-report'(event) {
		event.preventDefault();

		Dialogs.insert({
			heading: 'Confirmation',
			message: 'Are you sure you want to delete this Report?',
			confirmClass: 'js-delete-report-confirmed',
		});
	},

	'click .js-delete-user'(event) {
		if (!$(event.currentTarget).hasClass('disabled')) {
			Dialogs.insert({
				heading: 'Confirmation',
				message: 'Are you sure you want to delete this User?',
				confirmClass: 'js-delete-user-confirmed',
			});
		}
	},
});