import {Template} from 'meteor/templating';
import { SchoolWork } from '../../../../api/schoolWork/schoolWork.js';
import './schoolWorkEach.html';

Template.schoolWorkEach.onCreated( function() {
	Session.setPersistent('unScrolled', true);
});

Template.schoolWorkEach.onRendered( function() {

});

Template.schoolWorkEach.helpers({
	scroll: function() {
		if (Session.get('unScrolled') && SchoolWork.find({_id: FlowRouter.getParam('selectedSchoolWorkId')}).count()) {
			setTimeout(function() {
				let newScrollTop = document.getElementById(FlowRouter.getParam('selectedSchoolWorkId')).getBoundingClientRect().top - 130;
				if (window.screen.availWidth > 640) {
					document.getElementsByClassName('frame-two')[0].scrollTop = newScrollTop;
				}
				Session.setPersistent('unScrolled', false);
				return false;
			}, 100);
		}
	},
	
	selectedStudentId: function() {
		return Session.get('selectedStudentId');
	},

	selectedSchoolYearId: function() {
		return Session.get('selectedSchoolYearId');
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedSchoolWorkId') === id) {
			return true;
		}
		return false;
	},

	noSubjectWork: function() {
		return SchoolWork.find({type: 'work', subjectId: {$exists: false}});
	},

	getNoSubject: function(workType, subjectId) {
		if (workType === 'work' && !subjectId) {
			return true;
		}
		return false;
	},

	getType: function(workType, type) {
		if (workType === type) {
			return true;
		}
		return false;
	},

	getWork: function(subjectId) {
		return SchoolWork.find({subjectId: subjectId});
	}
});

Template.schoolWorkEach.events({
	'click .js-subject-toggle'(event) {
		let listClass = '.js-' + $(event.currentTarget).attr('data-subject-index');

		if ($(event.currentTarget).hasClass('js-open')) {
			$(event.currentTarget).removeClass('js-open');
			$(event.currentTarget).find('.js-caret-right').show();
			$(event.currentTarget).find('.js-caret-down').hide();
			$(listClass).slideUp(100);
		} else {
			$(event.currentTarget).addClass('js-open');
			$(event.currentTarget).find('.js-caret-right').hide();
			$(event.currentTarget).find('.js-caret-down').show();
			$(listClass).slideDown(200);
		}
	},
});



