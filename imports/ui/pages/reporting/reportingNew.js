import { Template } from 'meteor/templating';
import { Reports } from '../../../api/reports/reports.js';
import './reportingNew.html';

Template.reportingNew.onCreated( function() {
	
});

Template.reportingNew.onRendered( function() {
	Session.set({
		toolbarType: 'new',
		labelTwo: 'New Report',
		selectedFramePosition: 2,
		selectedFrameClass: 'frame-position-two',
		activeNav: 'reportingList',
	});

	Session.set('activeNav', 'reportingView');

	// Form Validation and Submission
	$('.js-form-reports-new').validate({
		rules: {
			name: { required: true },
		},
		messages: {
			name: { required: "Required." },
		},		

		submitHandler() {
			$('.loading-saving').show();
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
					
					$('.js-loading').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					FlowRouter.go('/reporting/view/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ reportId);
				}
			});

			return false;
		}
	});
});

Template.reportingNew.helpers({
	
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

	'click .js-cancel'(event) {
		event.preventDefault();
		
		Session.setPersistent('selectedFramePosition', 1);
		Session.setPersistent('selectedFrameClass', 'frame-position-one');
		FlowRouter.go('/reporting/view/' + Session.get('selectedStudentId') +'/'+ Session.get('selectedSchoolYearId') +'/'+ Session.get('selectedReportId'))
	},
});