import {Template} from 'meteor/templating';
import { Students } from '../../../api/students/students.js';
import { Subjects } from '../../../api/subjects/subjects.js';
import { Weeks } from '../../../api/weeks/weeks.js';
import { Lessons } from '../../../api/lessons/lessons.js';
import './trackingList.html';

Template.trackingList.onCreated( function() {
	// Subscriptions
	this.subscribe('allStudents');
	this.subscribe('allSubjectsProgress');
	this.subscribe('allWeeksProgress');
	this.subscribe('allLessonsProgress');
});

Template.trackingList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'Tracking',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'trackingList');
});

Template.trackingList.helpers({
	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},

	selectedSchoolYear: function() {
		return Session.get('selectedSchoolYear');
	},

	selectedTerm: function() {
		return Session.get('selectedTerm');
	},

	yearsProgress: function(studentId, selectedSchoolYearId) {
		let subjectIds = Subjects.find({studentId: studentId, schoolYearId: selectedSchoolYearId}).map(subject => (subject._id));
		let lessonsTotal = Lessons.find({subjectId: {$in: subjectIds}}).count();
		let lessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, completed: true}).count();
		let percentComplete = lessonsCompletedTotal / lessonsTotal * 100;
		if (percentComplete > 0 && percentComplete < 1) {
			return 1;
		}
		return Math.floor(percentComplete);
	},

	termsProgress: function(studentId, selectedSchoolYearId, selectedTermId) {
		let subjectIds = Subjects.find({studentId: studentId, schoolYearId: selectedSchoolYearId}).map(subject => (subject._id));
		let weeksIds = Weeks.find({termId: selectedTermId}).map(week => (week._id))
		let lessonsTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weeksIds}}).count();
		let lessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weeksIds}, completed: true}).count();
		let percentComplete = lessonsCompletedTotal / lessonsTotal * 100;
		if (percentComplete > 0 && percentComplete < 1) {
			return 1;
		}
		return Math.floor(percentComplete);
	},

	yearsProgressStatus: function(studentId, selectedSchoolYearId) {
		let subjectIds = Subjects.find({studentId: studentId, schoolYearId: selectedSchoolYearId}).map(subject => (subject._id));
		let lessonsIncompleteTotal = Lessons.find({subjectId: {$in: subjectIds}, completed: false}).count();
		if (!lessonsIncompleteTotal) {
			return 'meter-progress-primary';
		}
		return false;
	},

	termsProgressStatus: function(studentId, selectedSchoolYearId, selectedTermId) {
		let subjectIds = Subjects.find({studentId: studentId, schoolYearId: selectedSchoolYearId}).map(subject => (subject._id));
		let weeksIds = Weeks.find({termId: selectedTermId}).map(week => (week._id))
		let lessonsIncompleteTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weeksIds}, completed: false}).count();
		if (!lessonsIncompleteTotal) {
			return 'meter-progress-primary';
		}
		return false;
	},

});