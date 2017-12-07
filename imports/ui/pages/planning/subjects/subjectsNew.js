import {Template} from 'meteor/templating';
import { Students } from '../../../../api/students/students.js';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import './subjectsNew.html';

Template.subjectsNew.onRendered( function() {
	// Subscriptions
	Meteor.subscribe('allStudents');
	Meteor.subscribe('allSchoolYears');

	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		leftCaret: false,
		label: 'New Subject',
		rightUrl: '',
		rightIcon: '',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
})

Template.subjectsNew.helpers({
	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},
	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},
});