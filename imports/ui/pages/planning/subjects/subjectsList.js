import {Template} from 'meteor/templating';
import { Subjects } from '../../../../api/subjects/subjects.js';
import { Students } from '../../../../api/students/students.js';
import './subjectsList.html';

Template.subjectsList.onCreated( function() {
	// Subscriptions
	this.subscribe('allSubjects');
	this.subscribe('allStudents');
});

Template.subjectsList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/list',
		leftIcon: 'fss-back',
		label: 'Subjects',
		rightUrl: '/planning/subjects/new',
		rightIcon: 'fss-new',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.subjectsList.helpers({
	subjects: function() {
		return Subjects.find({studentId: Session.get('selectedStudent')._id, schoolYearId: Session.get('selectedSchoolYear')._id}, {sort: {studentId: 1, order: 1}});
	},
});

Template.subjectsList.events({
	
});