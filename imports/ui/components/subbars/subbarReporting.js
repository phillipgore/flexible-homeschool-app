import {Template} from 'meteor/templating';
import {SchoolYears} from '../../../api/schoolYears/schoolYears.js';
import {Students} from '../../../api/students/students.js';
import moment from 'moment';
import './subbarReporting.html';

Template.subbarReporting.onCreated( function() {
	Session.set('selectedSchoolYearId', FlowRouter.getParam('selectedSchoolYearId'))
	Session.set('selectedStudentId', FlowRouter.getParam('selectedStudentId'))
	
	// Subscriptions
	this.subscribe('allStudents');
	this.subscribe('allSchoolYears');
});

Template.subbarReporting.helpers({
	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},

	selectedSchoolYear: function() {
		return SchoolYears.find({_id: FlowRouter.getParam('selectedSchoolYearId')})
	},

	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},

	selectedStudent: function() {
		return Students.find({_id: FlowRouter.getParam('selectedStudentId')})
	},

	subbarAvailable: function() {
		if (!Session.get('selectedSchoolYear') || !Session.get('selectedStudent')) {
			return false;
		}
		return true
	},

	activeListItem: function(currentItem, item) {
		if (currentItem === item) {
			return true;
		}
		return false;
	},
});

Template.subbarReporting.events({
	// 'click .js-school-years'(event) {
	// 	event.preventDefault();

	// 	let schoolYearId = $(event.currentTarget).attr('id');
	// 	if (schoolYearId === 'all-years') {
	// 		Session.set('selectedSchoolYear', {_id: 'all-years', startYear: 'All', endYear: 'Years'})
	// 	} else {
	// 		Session.set('selectedSchoolYear', SchoolYears.findOne({_id: schoolYearId}))
	// 	}
	// },

	// 'click .js-students'(event) {
	// 	event.preventDefault();

	// 	let studentId = $(event.currentTarget).attr('id');
	// 	Session.set('selectedStudent', Students.findOne({_id: studentId}));
	// }
});









