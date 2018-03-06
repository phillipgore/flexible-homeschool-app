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
	subjectsCount: function() {
		return Subjects.find().count();
	},

	subjects: function() {
		if (Session.get('selectedSchoolYear') && Session.get('selectedSchoolYear')._id === 'all-years') {
			return Session.get('selectedStudent') && Subjects.find({studentId: Session.get('selectedStudent')._id}, {sort: {order: 1}});
		} else {
			return Session.get('selectedStudent') && Subjects.find({studentId: Session.get('selectedStudent')._id, schoolYearId: Session.get('selectedSchoolYear')._id}, {sort: {order: 1}});
		}
	},
});

Template.subjectsList.events({
	
});