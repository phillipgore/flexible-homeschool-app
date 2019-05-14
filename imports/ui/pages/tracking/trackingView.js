import {Template} from 'meteor/templating';
import { Students } from '../../../api/students/students.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import { SchoolWork } from '../../../api/schoolWork/schoolWork.js';
import { Terms } from '../../../api/terms/terms.js';
import { Weeks } from '../../../api/weeks/weeks.js';

import './trackingView.html';

Template.trackingView.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		// Subscriptions
		this.trackingData = Meteor.subscribe('trackingViewPub', FlowRouter.getParam('selectedStudentId'), FlowRouter.getParam('selectedWeekId'));
	});

	Session.set({
		selectedStudentId: FlowRouter.getParam('selectedStudentId'),
		selectedSchoolYearId: FlowRouter.getParam('selectedSchoolYearId'),
		selectedTermId: FlowRouter.getParam('selectedTermId'),
		selectedWeekId: FlowRouter.getParam('selectedWeekId'),
		toolbarType: 'tracking',
		editUrl: '',
		newUrl: '',
	});
});

Template.trackingView.onRendered( function() {
	Session.set({
		activeNav: 'trackingList',
	});
});

Template.trackingView.helpers({
	subscriptionReady: function() {
		return Template.instance().trackingData.ready();
	},

	student: function() {
		return Students.findOne({_id: FlowRouter.getParam('selectedStudentId')});
	},

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	selectedSchoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	selectedTerm: function() {
		return Terms.findOne({_id: FlowRouter.getParam('selectedTermId')});
	},

	selectedWeek: function() {
		return Weeks.findOne({_id: FlowRouter.getParam('selectedWeekId')});
	},

	schoolWork: function() {
		return SchoolWork.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}, {sort: {name: 1}});
	},

	schoolWorkOne: function(schoolWorkCount) {
		let schoolWorkLimit = SchoolWork.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}).count() / 2;
		return SchoolWork.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}, {sort: {name: 1}, limit: schoolWorkLimit});
	},

	schoolWorkTwo: function(schoolWorkCount) {
		let schoolWorkSkip = SchoolWork.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}).count() / 2;
		return SchoolWork.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}, {sort: {name: 1}, skip: schoolWorkSkip});
	},

	studentName(first, last) {
		if (first && last) {
			Session.set({labelTwo: first + ' ' + last});
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











