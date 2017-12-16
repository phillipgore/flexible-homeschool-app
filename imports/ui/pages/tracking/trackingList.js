import {Template} from 'meteor/templating';
import { Students } from '../../../api/students/students.js';
import './trackingList.html';

Template.subjectsNew.onCreated( () => {
	// Subscriptions
	this.subscribe('allStudents');
});

Template.trackingList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		leftCaret: false,
		label: 'Tracking',
		rightUrl: '',
		rightIcon: '',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'trackingList');
});

Template.trackingList.helpers({
	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},
});