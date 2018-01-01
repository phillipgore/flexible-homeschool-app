import {Template} from 'meteor/templating';
import { Subjects } from '../../../../api/subjects/subjects.js';
import './subjectsList.html';

Template.subjectsList.onCreated( function() {
	// Subscriptions
	this.subscribe('allSubjects');
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
		return Subjects.find({}, {sort: {order: 1}});
	},
});

Template.subjectsList.events({
	
});