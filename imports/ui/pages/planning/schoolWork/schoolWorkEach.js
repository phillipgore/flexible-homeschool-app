import {Template} from 'meteor/templating';
import { SchoolWork } from '../../../../api/schoolWork/schoolWork.js';
import './schoolWorkEach.html';
import Sortable from 'sortablejs';


Template.schoolWorkEach.onCreated( function() {
	Session.setPersistent('unScrolled', true);
});

Template.schoolWorkEach.onRendered( function() {
	var schoolWork = document.getElementById('js-school-work-sortable');
	var sortable = Sortable.create(schoolWork, {
		group: {
			name: 'schoolWork',
			pull: true,
			put: ['schoolWork', 'work']
		},
		animation: 150,
		ghostClass: "sortable-ghost",  // Class name for the drop placeholder
		chosenClass: "sortable-chosen",  // Class name for the chosen item
		dragClass: "sortable-drag",  // Class name for the dragging item
		handle: ".list-item-handles",
		onUpdate: function (event) {
			console.log('update school work')
		}
	});

	$('.js-work-sortable').each(function() {
		var work = document.getElementById(this.id);
		var sortable = Sortable.create(work, {
			group: {
				name: 'work',
				pull: true,
				put: ['schoolWork', 'work']
			},
			animation: 150,
			ghostClass: "sortable-ghost",  // Class name for the drop placeholder
			chosenClass: "sortable-chosen",  // Class name for the chosen item
			dragClass: "sortable-drag",  // Class name for the dragging item
			handle: ".list-item-handles",
			onEnd: function (event) {
				console.log('/--- event.item ---/');
				console.log(event.item);
				console.log('/--- event.to ---/');
				console.log(event.to);
				console.log('/--- event.from ---/');
				console.log(event.from);
				console.log('/--- event.oldIndex ---/');
				console.log(event.oldIndex);
				console.log('/--- event.newIndex ---/');
				console.log(event.newIndex);
				console.log('/--- event.oldDraggableIndex ---/');
				console.log(event.oldDraggableIndex);
				console.log('/--- event.newDraggableIndex ---/');
				console.log(event.newDraggableIndex);
				console.log('/--- event.clone ---/');
				console.log(event.clone);
				console.log('/--- event.pullMode ---/');
				console.log(event.pullMode);

				if ($(event.to).hasClass('js-subject')) {
					
				}
			},
		});
	});
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



