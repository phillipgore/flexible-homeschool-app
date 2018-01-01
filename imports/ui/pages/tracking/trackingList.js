import {Template} from 'meteor/templating';
import { Students } from '../../../api/students/students.js';
import './trackingList.html';

Template.trackingList.onCreated( function() {
	// Subscriptions
	this.subscribe('allStudents');
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
});