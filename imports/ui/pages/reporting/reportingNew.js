import { Template } from 'meteor/templating';
import { Reports } from '../../../api/reports/reports.js';
import './reportingNew.html';

Template.reportingNew.onCreated( function() {
	
});

Template.reportingNew.onRendered( function() {
	Session.set({
		toolbarType: 'new',
		labelTwo: 'New Report',
		activeNav: 'reportingList',
	});

	// Form Validation and Submission
	$('.js-form-reports-new').validate({
		rules: {
			name: { required: true },
		},
		messages: {
			name: { required: "Required." },
		},		

		submitHandler() {
			$('.js-saving').show();
			$('.js-submit').prop('disabled', true);

			let reportPoperties = {
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
			
			Meteor.call('insertReport', reportPoperties, function(error, reportId) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
					
					$('.js-saving').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					FlowRouter.go('/reporting/view/2/' + Session.get('selectedStudentId') +'/'+ Session.get('selectedSchoolYearId') +'/'+ reportId);
				}
			});

			return false;
		}
	});
});



Template.reportingNew.helpers({
	selectedStudentId: function() {
		return Session.get('selectedStudentId');
	},

	selectedSchoolYearId: function() {
		return Session.get('selectedSchoolYearId');
	},

	selectedReportId: function() {
		return Session.get('selectedReportId');
	},
});

Template.reportingNew.events({
	'change .js-checkbox'(event) {
	    if ($(event.currentTarget).val() === 'true') {
	    	$(event.currentTarget).val('false');
	    } else {
	    	$(event.currentTarget).val('true');
	    }
	},

	'submit .js-form-reports-new'(event) {
		event.preventDefault();
	},
});