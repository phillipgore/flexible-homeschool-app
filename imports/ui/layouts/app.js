import {Template} from 'meteor/templating';
import { Groups } from '../../api/groups/groups.js';
import { SchoolYears } from '../../api/schoolYears/schoolYears.js';
import { Students } from '../../api/students/students.js';
import { Terms } from '../../api/terms/terms.js';
import { Weeks } from '../../api/weeks/weeks.js';
import './app.html';
import moment from 'moment';
import _ from 'lodash'

Alerts = new Mongo.Collection(null);

// Template.app.onRendered( function() {
// 	Alerts.insert({
// 		colorClass: 'bg-info',
// 		iconClass: 'fss-info',
// 		message: 'Alert test.',
// 	});
// });

Template.app.helpers({
	connectionStatus: function() {
		console.log(Meteor.status())
		return Meteor.status();
	},

	windowHeight: function() {
		return Session.get('windowHeight');
	},

	windowWidth: function() {
		return Session.get('windowWidth');
	},

	alerts: function() {
		return Alerts.find();
	},

	selectedFrameClass: function() {
		return Session.get('selectedFrameClass')
	},

	showSubbar: function() {
		if (Session.get('windowHeight') >= 640 || Session.get('selectedFramePosition') === 2 || FlowRouter.current().route.name === 'trackingView' || FlowRouter.current().route.name === 'createAccount' || FlowRouter.current().route.name === 'verifySent' || FlowRouter.current().route.name === 'verifySuccess' || FlowRouter.current().route.name === 'signIn' || FlowRouter.current().route.name === 'reset' || FlowRouter.current().route.name === 'resetSent' || FlowRouter.current().route.name === 'resetPassword' || FlowRouter.current().route.name === 'resetSuccess') {
			return true;
		}
		return false;
	},
});

Template.app.events({
	// Universal Click Event
	'click'(event) {
		if (!$(event.currentTarget).hasClass('js-dropdown') && !$(event.target).hasClass('js-click-exempt')) {
			$('.dropdown-menu, .list-item-dropdown-menu').fadeOut(100);
		}
	},


	// Select Input
	'focus .fss-select select'(event) {
		$(event.target).parent().addClass('focus');
	},

	'blur .fss-select select'(event) {
		$(event.target).parent().removeClass('focus');
	},


	// Dropdown Button
	'click .js-dropdown'(event) {
		event.preventDefault();
		let menuId = $(event.currentTarget).attr('data-menu');

		$('.dropdown-menu, .list-item-dropdown-menu').not(menuId).fadeOut(100);

		if ($(menuId).is(':visible')) {
			$(menuId).fadeOut(100);
			$(menuId).removeAttr('style');
		} else {
			let maxMenuHeight = $('#__blaze-root').height() - 118;
			$(menuId).css({maxHeight: maxMenuHeight}).fadeIn(200);
		}
	},


	// FSS Alerts
	'click .js-alert-close'(event) {
		event.preventDefault();
		const alertId = event.currentTarget.id

		$('#' + alertId).parent().addClass('alert-fade-out');
		setTimeout(function(){
			Alerts.remove({_id: alertId});
		}, 350);
	},


	// Frame Positon
	'click .frame-one a.list-item-link'(event) {
		Session.setPersistent('selectedFramePosition', 2);
		Session.setPersistent('selectedFrameClass', 'frame-position-two');
	},

	'click .frame-two a.list-item-link'(event) {
		Session.setPersistent('selectedFramePosition', 3);
		Session.setPersistent('selectedFrameClass', 'frame-position-three');
	},

	'click .js-btn-back'(event) {
		let newFramePosition = Session.get('selectedFramePosition') - 1;

		if (newFramePosition === 2) {
			Session.setPersistent('selectedFramePosition', 2);
			Session.setPersistent('selectedFrameClass', 'frame-position-two');
		} else {
			Session.setPersistent('selectedFramePosition', 1);
			Session.setPersistent('selectedFrameClass', 'frame-position-one');
		}
	},


	// List Selections
	'click .js-user'(event) {
		Session.set('selectedUserId', $(event.currentTarget).attr('id'));
	},

	'click .js-student'(event) {
		Session.set({
			selectedStudentId: $(event.currentTarget).attr('id'),
			editUrl: '/planning/students/edit/' + $(event.currentTarget).attr('id'),
		});

		let sessionSubjectIdName = 'selectedSubject' + $(event.currentTarget).attr('id') + Session.get('selectedSchoolYearId') + 'Id';
		Session.set('selectedSubjectId', Session.get(sessionSubjectIdName));
	},

	'click .js-planning-student'(event) {
		Session.set({
			selectedStudentId: $(event.currentTarget).attr('id'),
			editUrl: '/planning/students/edit/' + $(event.currentTarget).attr('id'),
		});

		let termId = InitialIds.find().fetch()[0]['term' + $(event.currentTarget).attr('id') + Session.get('selectedSchoolYearId')];
		let weekId = InitialIds.find().fetch()[0]['week' + $(event.currentTarget).attr('id') + Session.get('selectedSchoolYearId') + termId];
		Session.set('selectedTermId', termId);
		Session.set('selectedWeekId', weekId);
	},

	'click .js-school-year'(event) {
		Session.set({
			selectedSchoolYearId: $(event.currentTarget).attr('id'),
			editUrl: '/planning/schoolyears/edit/' + $(event.currentTarget).attr('id'),
		});

		let sessionSubjectIdName = 'selectedSubject' + Session.get('selectedStudentId') + $(event.currentTarget).attr('id') + 'Id';
		Session.set('selectedSubjectId', Session.get(sessionSubjectIdName));
	},

	'click .js-planning-school-year'(event) {
		Session.set({
			selectedSchoolYearId: $(event.currentTarget).attr('id'),
			editUrl: '/planning/schoolyears/edit/' + $(event.currentTarget).attr('id'),
		});

		let termId = InitialIds.find().fetch()[0]['term' + Session.get('selectedStudentId') + $(event.currentTarget).attr('id')];
		let weekId = InitialIds.find().fetch()[0]['week' + Session.get('selectedStudentId') + $(event.currentTarget).attr('id') + termId];
		Session.set('selectedTermId', termId);
		Session.set('selectedWeekId', weekId);
	},

	'click .js-term'(event) {
		Session.set('selectedTermId', $(event.currentTarget).attr('id'));
	},

	'click .js-week'(event) {
		Session.set('selectedWeekId', $(event.currentTarget).attr('id'));
	},

	'click .js-resource'(event) {
		Session.set({
			selectedResourceId: $(event.currentTarget).attr('id'),
			selectedResourceCurrentTypeId: $(event.currentTarget).attr('data-resource-type'),
			editUrl: '/planning/resources/edit/' + Session.get('selectedResourceType') +'/'+ Session.get('selectedResourceAvailability') +'/'+ $(event.currentTarget).attr('id') +'/'+ $(event.currentTarget).attr('data-resource-type'),
		});
	},

	'click .js-type'(event) {
		Session.set({
			selectedResourceType: $(event.currentTarget).attr('data-resource-type'),
			selectedResourceId: $(event.currentTarget).attr('id'),
			selectedResourceCurrentTypeId: $(event.currentTarget).attr('data-resource-type'),
			editUrl: '/planning/resources/edit/' + $(event.currentTarget).attr('data-resource-type') +'/'+ Session.get('selectedResourceAvailability') +'/'+ $(event.currentTarget).attr('id') +'/'+ $(event.currentTarget).attr('data-resource-type'),
		});
	},

	'click .js-availability'(event) {
		Session.set({
			selectedResourceAvailability: $(event.currentTarget).attr('data-resource-availability'),
			selectedResourceId: $(event.currentTarget).attr('id'),
			selectedResourceCurrentTypeId: $(event.currentTarget).attr('data-resource-type'),
			editUrl: '/planning/resources/edit/' + $(event.currentTarget).attr('data-resource-type') +'/'+ $(event.currentTarget).attr('data-resource-availability') +'/'+ $(event.currentTarget).attr('id') +'/'+ $(event.currentTarget).attr('data-resource-type'),
		});
	},

	'click .js-new-resource'(event) {
		Session.set({
			selectedResourceType: 'all',
			selectedResourceAvailability: 'all',
			selectedResourceId: InitialIds.findOne().resourceAllAll,
			selectedResourceCurrentType: InitialIds.findOne().resourceCurrentType,
		});
	},

	'click .js-subject'(event) {
		Session.set({
			selectedStudentId: $(event.currentTarget).attr('data-subject-student'),
			selectedSchoolYearId: $(event.currentTarget).attr('data-subject-school-Year'),
			selectedSubjectId: $(event.currentTarget).attr('id'),
			editUrl: '/planning/subjects/edit/' + $(event.currentTarget).attr('data-subject-student') +'/'+ $(event.currentTarget).attr('data-subject-school-Year') +'/'+ $(event.currentTarget).attr('id'),
		});
	},

	'click .js-report'(event) {
		Session.set('selectedReportId', $(event.currentTarget).attr('id'));
	}
});









