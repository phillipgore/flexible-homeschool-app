import {Template} from 'meteor/templating';
import { Groups } from '../../api/groups/groups.js';
import { SchoolYears } from '../../api/schoolYears/schoolYears.js';
import { Students } from '../../api/students/students.js';
import { Resources } from '../../api/resources/resources.js';
import { SchoolWork } from '../../api/schoolWork/schoolWork.js';
import { Reports } from '../../api/reports/reports.js';
import { Terms } from '../../api/terms/terms.js';
import { Weeks } from '../../api/weeks/weeks.js';
import './app.html';
import moment from 'moment';
import _ from 'lodash'

Alerts = new Mongo.Collection(null);
Dialogs = new Mongo.Collection(null);

Template.app.onRendered( function() {
	$('.loading-initializing').fadeOut('fast', function() {
		$(this).remove();
	});
});

Template.app.helpers({
	userId: function() {
		return Meteor.userId();
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

	dialog: function() {
		return Dialogs.findOne();
	},

	selectedFrameClass: function() {
		return Session.get('selectedFrameClass')
	},

	showSubbar: function() {
		if (Session.get('windowHeight') >= 640 || Session.get('selectedFramePosition') === 2 || Session.get('selectedFramePosition') === 3 || FlowRouter.current().route.name === 'trackingView' || FlowRouter.current().route.name === 'createAccount' || FlowRouter.current().route.name === 'verifySent' || FlowRouter.current().route.name === 'verifySuccess' || FlowRouter.current().route.name === 'signIn' || FlowRouter.current().route.name === 'reset' || FlowRouter.current().route.name === 'resetSent' || FlowRouter.current().route.name === 'resetPassword' || FlowRouter.current().route.name === 'resetSuccess') {
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
	'focus .icn-select select'(event) {
		$(event.target).parent().addClass('focus');
	},

	'blur .icn-select select'(event) {
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


	// Alerts
	'click .js-alert-close'(event) {
		event.preventDefault();
		const alertId = event.currentTarget.id

		$('#' + alertId).parent().addClass('alert-fade-out');
		setTimeout(function(){
			Alerts.remove({_id: alertId});
		}, 350);
	},

	// Show/Hide Help
	'click .js-show-help'(event) {
		event.preventDefault();

		let helpClass = '.' + $(event.currentTarget).attr('id');

		$('.js-show').show();
		$('.js-hide').hide();
		$('.js-info').slideUp('fast');

		if ($(event.currentTarget).hasClass('js-closed')) {
			$(event.currentTarget).removeClass('js-closed').addClass('js-open');
			$(event.currentTarget).find('.js-show').hide();
			$(event.currentTarget).find('.js-hide').show();
			$(helpClass).slideDown('fast');
		} else {
			$(event.currentTarget).removeClass('js-open').addClass('js-closed');
		}		
	},

	// Dialog Confirmations
	'click .js-dialog-cancel'(event) {
		event.preventDefault();
		const dialogId = Dialogs.findOne()._id;
		Dialogs.remove({_id: dialogId});
	},

	'click .js-delete-student-confirmed'(event) {
		event.preventDefault();
		$('.js-deleting').show();

		function nextStudentId(selectedStudentId) {
			let studentIds = Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}}).map(student => (student._id));
			let selectedIndex = studentIds.indexOf(selectedStudentId);

			if (selectedIndex) {
				return studentIds[selectedIndex - 1]
			}
			return studentIds[selectedIndex + 1]
		};

		let newStudentId = nextStudentId(FlowRouter.getParam('selectedStudentId'));
		let dialogId = Dialogs.findOne()._id;

		Dialogs.remove({_id: dialogId});
		Meteor.call('deleteStudent', FlowRouter.getParam('selectedStudentId'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
			} else {
				Dialogs.remove({_id: dialogId});
				Session.set('selectedStudentId', newStudentId)
				if (window.screen.availWidth > 768) {
					FlowRouter.go('/planning/students/view/3/' + newStudentId);
				} else {
					FlowRouter.go('/planning/students/view/2/' + newStudentId);
				}
				$('.js-deleting').hide();
			}
		});
	},
	
	'click .js-delete-school-year-confirmed'(event) {
		event.preventDefault();
		$('.js-deleting').show();

		function nextSchoolYearId(selectedSchoolYearId) {
			let schoolYearIds = SchoolYears.find({}, {sort: {startYear: 1}}).map(schoolYear => (schoolYear._id));
			let selectedIndex = schoolYearIds.indexOf(selectedSchoolYearId);

			if (selectedIndex) {
				return schoolYearIds[selectedIndex - 1]
			}
			return schoolYearIds[selectedIndex + 1]
		};

		let newSchoolYearId = nextSchoolYearId(FlowRouter.getParam('selectedSchoolYearId'))
		let dialogId = Dialogs.findOne()._id;

		Dialogs.remove({_id: dialogId});
		Meteor.call('deleteSchoolYear', FlowRouter.getParam('selectedSchoolYearId'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
			} else {
				Dialogs.remove({_id: dialogId});
				Session.set('selectedSchoolYearId', newSchoolYearId)
				if (window.screen.availWidth > 768) {
					FlowRouter.go('/planning/schoolyears/view/3/' + newSchoolYearId);
				} else {
					FlowRouter.go('/planning/schoolyears/view/2/' + newSchoolYearId);
				}
				$('.js-deleting').hide();
			}
		});
	},

	'click .js-delete-resource-confirmed'(event) {
		event.preventDefault();
		$('.js-deleting').show();

		function nextResourceId(selectedResourceId) {
			let resourceIds = Resources.find({}, {sort: {title: 1}}).map(resource => (resource._id));

			if (resourceIds.length > 1) {
				let selectedIndex = resourceIds.indexOf(selectedResourceId);
				if (selectedIndex) {
					return Resources.findOne({_id: resourceIds[selectedIndex - 1]});
				}
				return Resources.findOne({_id: resourceIds[selectedIndex + 1]});
			}
			return {_id: 'empty', type: 'empty'}
		};

		let newResource = nextResourceId(FlowRouter.getParam('selectedResourceId'))
		const dialogId = Dialogs.findOne()._id;

		Dialogs.remove({_id: dialogId});
		Meteor.call('deleteResource', FlowRouter.getParam('selectedResourceId'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
			} else {
				Session.set('selectedResourceId', newResource._id);
				if (window.screen.availWidth > 768) {
					FlowRouter.go('/planning/resources/view/3/' + FlowRouter.getParam('selectedResourceType') +'/'+ FlowRouter.getParam('selectedResourceAvailability') +'/'+ newResource._id +'/'+ newResource.type);
				} else {
					FlowRouter.go('/planning/resources/view/2/' + FlowRouter.getParam('selectedResourceType') +'/'+ FlowRouter.getParam('selectedResourceAvailability') +'/'+ newResource._id +'/'+ newResource.type);
				}
				$('.js-deleting').hide();
			}
		});
	},
	
	'click .js-delete-schoolWork-confirmed'(event) {
		event.preventDefault();
		$('.js-deleting').show();

		function nextSchoolWorkId(selectedSchoolWorkId) {
			let schoolWorkIds = SchoolWork.find({}, {sort: {name: 1}}).map(schoolWork => (schoolWork._id));
			let selectedIndex = schoolWorkIds.indexOf(selectedSchoolWorkId);

			if (selectedIndex) {
				return schoolWorkIds[selectedIndex - 1]
			}
			return schoolWorkIds[selectedIndex + 1]
		};

		let newSchoolWorkId = nextSchoolWorkId(FlowRouter.getParam('selectedSchoolWorkId'));
		let dialogId = Dialogs.findOne()._id;

		let pathProperties = {
			studentIds: [FlowRouter.getParam('selectedStudentId')],
			schoolYearIds: [FlowRouter.getParam('selectedSchoolYearId')],
			termIds: SchoolWork.findOne({_id: FlowRouter.getParam('selectedSchoolWorkId')}).termStats.map(term => term.termId),
		}

		let statProperties = {
			studentIds: [FlowRouter.getParam('selectedStudentId')],
			schoolYearIds: [FlowRouter.getParam('selectedSchoolYearId')],
			termIds: SchoolWork.findOne({_id: FlowRouter.getParam('selectedSchoolWorkId')}).termStats.map(term => term.termId),
			weekIds: Weeks.find({}).map(week => week._id),
		}

		Dialogs.remove({_id: dialogId});
		Meteor.call('deleteSchoolWork', statProperties, pathProperties, FlowRouter.getParam('selectedSchoolWorkId'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
			} else {
				Session.set('selectedSchoolWorkId', newSchoolWorkId);
				if (window.screen.availWidth > 768) {
					FlowRouter.go('/planning/schoolWork/view/3/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ newSchoolWorkId);
				} else {
					FlowRouter.go('/planning/schoolWork/view/2/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ newSchoolWorkId);
				}
				$('.js-deleting').hide();
			}
		});
	},

	'click .js-delete-report-confirmed'(event) {
		event.preventDefault();
		$('.js-deleting').show();

		function nextReportId(selectedReportId) {
			let reportIds = Reports.find({}, {sort: {name: 1}}).map(report => (report._id));
			let selectedIndex = reportIds.indexOf(selectedReportId);

			if (reportIds.length === 1) {
				return 'empty';
			}
			if (selectedIndex) {
				return reportIds[selectedIndex - 1]
			}
			return reportIds[selectedIndex + 1]
		};

		let newReportId = nextReportId(FlowRouter.getParam('selectedReportId'));
		let dialogId = Dialogs.findOne()._id;

		Dialogs.remove({_id: dialogId});
		Meteor.call('deleteReport', FlowRouter.getParam('selectedReportId'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
			} else {
				Session.set('selectedReportId', newReportId);
				if (window.screen.availWidth > 768) {
					FlowRouter.go('/reporting/view/2/' + Session.get('selectedStudentId') +"/"+ Session.get('selectedSchoolYearId') +'/'+ Session.get('selectedReportingTermId') +'/'+ Session.get('selectedReportingWeekId') +"/"+ newReportId);
				} else {
					FlowRouter.go('/reporting/view/1/' + Session.get('selectedStudentId') +"/"+ Session.get('selectedSchoolYearId') +'/'+ Session.get('selectedReportingTermId') +'/'+ Session.get('selectedReportingWeekId') +"/"+ newReportId);
				}
				$('.js-deleting').hide();
			}
		});
	},

	'click .js-delete-user-confirmed'(event) {
		event.preventDefault();
		$('.js-deleting').show();

		let dialogId = Dialogs.findOne()._id;
		let nextUserId = Meteor.users.findOne({'emails.0.verified': true, 'status.active': true})._id

		Dialogs.remove({_id: dialogId});
		Meteor.call('removeUser', FlowRouter.getParam('selectedUserId'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
			} else {
				Dialogs.remove({_id: dialogId});
				Session.set('selectedUserId', nextUserId);
				if (window.screen.availWidth > 768) {
					FlowRouter.go('/settings/users/view/3/' + nextUserId);
				} else {
					FlowRouter.go('/settings/users/view/2/' + nextUserId);
				}
				$('.js-deleting').hide();
			}
		});
	},

	'click .js-reset-password-confirmed'(event) {
		event.preventDefault();
		
		$('.js-signing-out').show();
		Dialogs.remove({});

		Accounts.logout(function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
			} else {
				FlowRouter.go("/reset");
			}
		});
	},


	// List Selections
	'click .js-user'(event) {
		Session.set({
			selectedUserId: $(event.currentTarget).attr('id'),
			editUrl: '/settings/users/edit/3/' + $(event.currentTarget).attr('id'),
		});
	},

	'click .js-student'(event) {
		Session.set({
			selectedStudentId: $(event.currentTarget).attr('id'),
			editUrl: '/planning/students/edit/3/' + $(event.currentTarget).attr('id'),
		});

		// let sessionSchoolWorkIdName = 'selectedSchoolWork' + $(event.currentTarget).attr('id') + Session.get('selectedSchoolYearId') + 'Id';
		// Session.set('selectedSchoolWorkId', Session.get(sessionSchoolWorkIdName));
	},

	'click .js-planning-student'(event) {
		Session.set({
			selectedStudentId: $(event.currentTarget).attr('id'),
			editUrl: '/planning/students/edit/3/' + $(event.currentTarget).attr('id'),
		});

		let termId = Session.get('initialIds')['termId'];
		let weekId = Session.get('initialIds')['weekId'];
		Session.set('selectedTermId', termId);
		Session.set('selectedWeekId', weekId);
	},

	'click .js-school-year'(event) {
		Session.set({
			selectedSchoolYearId: $(event.currentTarget).attr('id'),
			editUrl: '/planning/schoolyears/edit/3/' + $(event.currentTarget).attr('id'),
		});
		// let sessionSchoolWorkIdName = 'selectedSchoolWork' + Session.get('selectedStudentId') + $(event.currentTarget).attr('id') + 'Id';
		// console.log(sessionSchoolWorkIdName)
		// Session.set('selectedSchoolWorkId', Session.get(sessionSchoolWorkIdName));
	},

	'click .js-planning-school-year'(event) {
		Session.set({
			selectedSchoolYearId: $(event.currentTarget).attr('id'),
			editUrl: '/planning/schoolyears/edit/3/' + $(event.currentTarget).attr('id'),
		});

		let termId = Session.get('initialIds')['termId'];
		let weekId = Session.get('initialIds')['weekId'];
		Session.set('selectedTermId', termId);
		Session.set('selectedWeekId', weekId);
	},

	'click .js-term'(event) {
		let termId = $(event.currentTarget).attr('id');
		if (termId != 'allTerms') {
			Session.set('selectedTermId', termId);
		}
		Session.set('selectedReportingTermId', termId);
	},

	'click .js-week'(event) {
		let weekId = $(event.currentTarget).attr('id');
		if (weekId != 'allWeeks') {
			Session.set('selectedWeekId', weekId);
		}
		Session.set('selectedReportingWeekId', weekId);
	},

	'click .js-resource'(event) {
		Session.set({
			selectedResourceId: $(event.currentTarget).attr('id'),
			selectedResourceCurrentTypeId: $(event.currentTarget).attr('data-resource-type'),
			editUrl: '/planning/resources/edit/3/' + Session.get('selectedResourceType') +'/'+ Session.get('selectedResourceAvailability') +'/'+ $(event.currentTarget).attr('id') +'/'+ $(event.currentTarget).attr('data-resource-type'),
		});
	},

	'click .js-type'(event) {
		Session.set({
			selectedResourceType: $(event.currentTarget).attr('data-resource-type'),
			selectedResourceId: $(event.currentTarget).attr('id'),
			selectedResourceCurrentTypeId: $(event.currentTarget).attr('data-resource-type'),
			editUrl: '/planning/resources/edit/3/' + $(event.currentTarget).attr('data-resource-type') +'/'+ Session.get('selectedResourceAvailability') +'/'+ $(event.currentTarget).attr('id') +'/'+ $(event.currentTarget).attr('data-resource-type'),
		});
	},

	'click .js-availability'(event) {
		Session.set({
			selectedResourceAvailability: $(event.currentTarget).attr('data-resource-availability'),
			selectedResourceId: $(event.currentTarget).attr('id'),
			selectedResourceCurrentTypeId: $(event.currentTarget).attr('data-resource-type'),
			editUrl: '/planning/resources/edit/3/' + $(event.currentTarget).attr('data-resource-type') +'/'+ $(event.currentTarget).attr('data-resource-availability') +'/'+ $(event.currentTarget).attr('id') +'/'+ $(event.currentTarget).attr('data-resource-type'),
		});
	},

	'click .js-new-resource'(event) {
		Session.set({
			selectedResourceType: 'all',
			selectedResourceAvailability: 'all',
		});
	},

	'click .js-schoolWork'(event) {
		Session.set({
			selectedStudentId: $(event.currentTarget).attr('data-schoolWork-student'),
			selectedSchoolYearId: $(event.currentTarget).attr('data-schoolWork-school-Year'),
			selectedSchoolWorkId: $(event.currentTarget).attr('id'),
			editUrl: '/planning/schoolWork/edit/3/' + $(event.currentTarget).attr('data-schoolWork-student') +'/'+ $(event.currentTarget).attr('data-schoolWork-school-Year') +'/'+ $(event.currentTarget).attr('id'),
		});
	},

	'click .js-report'(event) {
		Session.set({
			selectedReportId: $(event.currentTarget).attr('id'),
			editUrl: '/reporting/edit/2/' + $(event.currentTarget).attr('id'),
		});
	},

	'click .js-report-student'(event) {
		Session.set({
			selectedStudentId: $(event.currentTarget).attr('id'),
			editUrl: '/reporting/edit/2/' + Session.get('selectedReportId'),
		});
	},

	'click .js-report-school-year'(event) {
		Session.set({
			selectedSchoolYearId: $(event.currentTarget).attr('id'),
			editUrl: '/reporting/edit/2/' + Session.get('selectedReportId'),
		});
	},
});









