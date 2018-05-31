import {Template} from 'meteor/templating';
import './toolbarLarge.html';

Template.toolbarLarge.helpers({
	logo: function() {
		if(Meteor.userId()) {
			return false;
		}
		return true;
	},

	backButton: function() {
		if (Session.get('selectedFramePosition') === 1 || Session.get('selectedFramePosition') === 2) {
			return false;
		}
		return true;
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
		if (Session.get('toolbarType') === 'user') {
			let verified = $('.js-user .active').attr('data-verified');
			let active = $('.js-user .active').attr('data-active');

			if (active && !verified) {
				return true;
			}
			return false;
		}
		if (Session.get('toolbarType') === 'tracking' || Session.get('toolbarType') === 'billing' || Session.get('toolbarType') === 'support') {
			return false;
		}
		return true;
	},

	deleteClass: function() {
		return 'js-delete-' + Session.get('toolbarType');
	},

	prinatable: function() {
		if (Session.get('toolbarType') === 'report' || Session.get('toolbarType') === 'resource') {
			return true;
		}
		return false;
	}
});

Template.toolbarLarge.events({
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

	'click .js-delete-school-year'(event) {
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