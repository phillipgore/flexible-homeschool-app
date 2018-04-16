import { Template } from 'meteor/templating';
import './reportingSettingsEdit.html';

Template.reportingSettingsEdit.onCreated( function() {
	// Subscriptions
	this.subscribe('userReportSettings');
});

Template.reportingSettingsEdit.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'Report Settings',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'reportingList');
});

Template.reportingSettingsEdit.helpers({
	user: function() {
		return Meteor.user();
	},

	selectedSchoolYearId: function() {
		return Session.get('selectedSchoolYearId');
	},

	selectedStudentId: function() {
		return Session.get('selectedStudentId');
	},
});

Template.reportingSettingsEdit.events({
	'change .js-checkbox'(event) {
	    if ($(event.currentTarget).val() === 'true') {
	    	$(event.currentTarget).val('false');
	    } else {
	    	$(event.currentTarget).val('true');
	    }
	},

	'submit .js-form-report-settings-update'(event) {
		event.preventDefault();

		$('.js-loading').show();
		$('.js-submit').prop('disabled', true);

		let reportingSettingsPoperties = {
			reportSettings: {
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
				
				lessonsReportVisible: event.currentTarget.lessonsReportVisible.value.trim() === 'true',
				lessonsDateVisible: event.currentTarget.lessonsDateVisible.value.trim() === 'true',
				lessonsTimeVisible: event.currentTarget.lessonsTimeVisible.value.trim() === 'true',
				lessonsDescriptionVisible: event.currentTarget.lessonsDescriptionVisible.value.trim() === 'true',
			}
		}
		
		Meteor.call('updateUserReportSettings', Meteor.userId(), reportingSettingsPoperties, function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
				
				$('.js-loading').hide();
				$('.js-submit').prop('disabled', false);
			} else {
				FlowRouter.go('/reporting/list/' + Session.get('selectedSchoolYearId') +"/"+ Session.get('selectedStudentId'));
			}
		});

		return false;
	},
});