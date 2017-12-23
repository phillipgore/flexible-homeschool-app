import {Template} from 'meteor/templating';
import { Subjects } from '../../../../api/subjects/subjects.js';
import './subjectsId.html';

Template.subjectsId.onCreated( function() {
	// Subscriptions
	this.subscribe('subject', FlowRouter.getParam('id'));

});

Template.subjectsId.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/subjects/list',
		leftIcon: 'fss-btn-back',
		leftCaret: false,
		label: '',
		rightUrl: '/planning/subjects/' + FlowRouter.getParam('id') + '/edit',
		rightIcon: 'fss-btn-edit',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.subjectsId.helpers({
	subject: function() {
		return Subjects.findOne({_id: FlowRouter.getParam('id')});
	},
	
	dynamicToolbarLabel: function() {
		let subjects = Subjects.findOne({_id: FlowRouter.getParam('id')});
		return subjects && subjects.name;
	},
});