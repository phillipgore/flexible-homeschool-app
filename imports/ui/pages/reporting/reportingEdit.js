import { Template } from 'meteor/templating';
import { Reports } from '../../../api/reports/reports.js';
import './reportingEdit.html';

Template.reportingEdit.onCreated( function() {
	// Subscriptions
	this.subscribe('allReports');
});

Template.reportingEdit.onRendered( function() {
	// Toolbar Settings
	Session.set({
		label: 'Report Settings',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'reportingView');

	// Form Validation and Submission
	$('.js-form-report-update').validate({
		rules: {
			name: { required: true },
		},
		messages: {
			name: { required: "Required." },
		},		

		submitHandler() {
			$('.js-loading').show();
			$('.js-submit').prop('disabled', true);

			let reportProperties = {
				_id: event.currentTarget._id.value.trim(),
				name: event.currentTarget.name.value.trim(),
				
				schoolYearReportVisible: event.currentTarget.schoolYearReportVisible.value.trim() === 'true',
				schoolYearStatsVisible: event.currentTarget.schoolYearStatsVisible.value.trim() === 'true',
				schoolYearProgressVisible: event.currentTarget.schoolYearProgressVisible.value.trim() === 'true',
				schoolYearTimesVisible: event.currentTarget.schoolYearTimesVisible.value.trim() === 'true',
				
				termsReportVisible: event.currentTarget.termsReportVisible.value.trim() === 'true',
				termsStatsVisible: event.currentTarget.termsStatsVisible.value.trim() === 'true',
				termsProgressVisible: event.currentTarget.termsProgressVisible.value.trim() === 'true',
				termsTimesVisible: event.currentTarget.termsTimesVisible.value.trim() === 'true',
				
				subjectsReportVisible: event.currentTarget.subjectsReportVisible.value.trim() === 'true',
				subjectsStatsVisible: event.currentTarget.subjectsStatsVisible.value.trim() === 'true',
				subjectsProgressVisible: event.currentTarget.subjectsProgressVisible.value.trim() === 'true',
				subjectsTimesVisible: event.currentTarget.subjectsTimesVisible.value.trim() === 'true',
				subjectsResourcesVisible: event.currentTarget.subjectsResourcesVisible.value.trim() === 'true',

				resourcesReportVisible: event.currentTarget.resourcesReportVisible.value.trim() === 'true',
				resourcesOriginatorVisible: event.currentTarget.resourcesOriginatorVisible.value.trim() === 'true',
				resourcesPublicationVisible: event.currentTarget.resourcesPublicationVisible.value.trim() === 'true',
				resourcesSubjectsVisible: event.currentTarget.resourcesSubjectsVisible.value.trim() === 'true',
				resourcesLinkVisible: event.currentTarget.resourcesLinkVisible.value.trim() === 'true',
				resourcesDescriptionVisible: event.currentTarget.resourcesDescriptionVisible.value.trim() === 'true',
			}
			
			Meteor.call('updateReport', reportProperties._id, reportProperties, function(error) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
					
					$('.js-loading').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					FlowRouter.go('/reporting/view/' + Session.get('selectedStudentId') +"/"+ Session.get('selectedSchoolYearId') +"/"+ Session.get('selectedReportId'));
				}
			});

			return false;
		}
	});
});

Template.reportingEdit.helpers({
	user: function() {
		return Meteor.user();
	},

	report: function() {
		return Reports.findOne(FlowRouter.getParam('selectedReportId'));
	},

	selectedSchoolYearId: function() {
		return Session.get('selectedSchoolYearId');
	},

	selectedStudentId: function() {
		return Session.get('selectedStudentId');
	},
	
	cancelPath: function() {
		return '/reporting/view/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedReportId');
	},
});

Template.reportingEdit.events({
	'change .js-checkbox'(event) {
	    if ($(event.currentTarget).val() === 'true') {
	    	$(event.currentTarget).val('false');
	    } else {
	    	$(event.currentTarget).val('true');
	    }
	},

	'submit .js-form-report-update'(event) {
		event.preventDefault();
	},
});