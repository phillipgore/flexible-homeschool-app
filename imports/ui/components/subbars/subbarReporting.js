import {Template} from 'meteor/templating';
import {SchoolYears} from '../../../api/schoolYears/schoolYears.js';
import {Students} from '../../../api/students/students.js';
import moment from 'moment';
import './subbarReporting.html';

Template.subbarReporting.helpers({
	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	selectedSchoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	yearStatus: function(schoolYearStatus) {
		if (schoolYearStatus === 'pending') {
			return 'txt-gray-darker';
		}
		if (schoolYearStatus === 'partial') {
			return 'txt-secondary';
		}
		if (schoolYearStatus === 'completed') {
			return 'txt-primary';
		}
	},

	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},

	selectedStudentId: function() {
		return FlowRouter.getParam('selectedStudentId');
	},

	selectedStudent: function() {
		return Students.findOne({_id: FlowRouter.getParam('selectedStudentId')});
	},

	selectedReportId: function() {
		return FlowRouter.getParam('selectedReportId');
	},
	
	activeListItem: function(currentItem, item) {
		if (currentItem === item) {
			return true;
		}
		return false;
	},
	
	reportsAvailable: function() {
		if (Session.get('selectedSchoolYearId') === 'empty' || Session.get('selectedStudentId') === 'empty') {
			return false;
		}
		return true;
	},
});








