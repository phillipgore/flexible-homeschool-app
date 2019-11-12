import {Template} from 'meteor/templating';
import { Stats } from '../../../api/stats/stats.js';
import { Students } from '../../../api/students/students.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../api/terms/terms.js';
import './trackingList.html';

import _ from 'lodash'

Template.trackingList.onCreated( function() {
	DocHead.setTitle('Tracking: View');
	// let template = Template.instance();

	// template.autorun(() => {
		this.trackingData = Meteor.subscribe('trackingListPub', FlowRouter.getParam('selectedStudentId'), FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedTermId'), FlowRouter.getParam('selectedWeekId'));
	// });
});

Template.trackingList.onRendered( function() {
	Session.set({
		labelOne: 'Tracking',
		activeNav: 'trackingList',
		selectedStudentId: FlowRouter.getParam('selectedStudentId'),
		toolbarType: 'tracking',
		newUrl: '',
	});
});

Template.trackingList.helpers({
	subscriptionReady: function() {
		return Template.instance().trackingData.ready();
	},

	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},

	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},

	terms: function() {
		return Terms.find({}, {sort: {order: 1}});
	},

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	selectedTermId: function() {
		return FlowRouter.getParam('selectedTermId');
	},

	selectedWeekId: function() {
		return FlowRouter.getParam('selectedWeekId');
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedStudentId') === id) {
			return true;
		}
		return false;
	},

	studentsSchoolYearsCount: function() {
		if (Students.find().count() && SchoolYears.find().count()) {
			return true;
		}
		return false;
	},

});









