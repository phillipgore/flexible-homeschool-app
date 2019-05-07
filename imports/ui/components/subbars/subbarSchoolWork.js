import {Template} from 'meteor/templating';
import {SchoolYears} from '../../../api/schoolYears/schoolYears.js';
import {Students} from '../../../api/students/students.js';
import {SchoolWork} from '../../../api/schoolWork/schoolWork.js';
import './subbarSchoolWork.html';

import moment from 'moment';
import _ from 'lodash'


Template.subbarSchoolWork.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.subscribe('studentPaths');
		this.subscribe('schoolYearPaths', FlowRouter.getParam('selectedStudentId'), false);
	});

	Meteor.call('getInitialSchoolWorkIds', function(error, result) {
		Session.set('initialSchoolWorkIds', result);
	});
});

Template.subbarSchoolWork.helpers({
	schoolWorkCount: function() {
		return SchoolWork.find().count();
	},

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

	studentSchoolYearSchoolWorkId: function(studentId, schoolYearId) {
		let schoolWorkIds = Session.get('initialSchoolWorkIds');
		let key = 'schoolWork' + studentId + schoolYearId;
		return schoolWorkIds[key];
	},
	
	activeListItem: function(currentItem, item) {
		if (currentItem === item) {
			return true;
		}
		return false;
	},
});