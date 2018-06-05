import {Template} from 'meteor/templating';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import './schoolYearsView.html';

Template.schoolYearsView.onCreated( function() {
	// Subscriptions
	Tracker.autorun(() => {
		this.schoolYearData = Meteor.subscribe('schoolYearView', FlowRouter.getParam('selectedSchoolYearId'));
	});
});

Template.schoolYearsView.onRendered( function() {
	Session.set({
		toolbarType: 'schoolYear',
		editUrl: '/planning/schoolyears/edit/' + FlowRouter.getParam('selectedSchoolYearId'),
		labelThree: 'School Year',
		activeNav: 'planningList',
	});
});

Template.schoolYearsView.helpers({
	subscriptionReady: function() {
		return Template.instance().schoolYearData.ready();
	},
	
	schoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	terms: function() {
		return Terms.find({schoolYearId: Session.get('selectedSchoolYearId')});
	},

	termWeeks: function(termId) {
		let weekCount = Weeks.find({termId: termId}).fetch().length;
		if (weekCount === 1) {
			return weekCount + ' Week';
		}
		return weekCount + ' Weeks';
	},
});

Template.schoolYearsView.events({
	'click .js-delete-school-year-confirmed'(event) {
		event.preventDefault();
		$('.loading-deleting').show();

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
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				Dialogs.remove({_id: dialogId});
				Session.set('selectedSchoolYearId', newSchoolYearId)
				FlowRouter.go('/planning/schoolyears/view/' + newSchoolYearId);
				$('.loading-deleting').hide();
			}
		});
	}
});





