import {Template} from 'meteor/templating';
import './office.html';

Template.office.onRendered( function() {
	$('.loading-initializing').fadeOut('fast', function() {
		$(this).remove();
	});
});

Template.office.helpers({
	windowHeight: function() {
		return Session.get('windowHeight');
	},

	windowWidth: function() {
		return Session.get('windowWidth');
	},

	alerts: function() {
		return Alerts.find();
	},

	dialog: function() {
		return Dialogs.findOne();
	},

	selectedFrameClass: function() {
		return Session.get('selectedFrameClass')
	},
});

Template.office.events({
	'click .js-group'(event) {
		Session.set('selectedGroupId', $(event.currentTarget).attr('id'));
	},

	'click .js-question'(event) {
		Session.set('selectedQuestionId', $(event.currentTarget).attr('id'));
	},

	// Alerts
	'click .js-alert-close'(event) {
		event.preventDefault();
		const alertId = event.currentTarget.id

		$('#' + alertId).parent().addClass('alert-fade-out');
		setTimeout(function(){
			Alerts.remove({_id: alertId});
		}, 350);
	},

	// Universal Click Event
	'click'(event) {
		if (!$(event.currentTarget).hasClass('js-dropdown') && !$(event.target).hasClass('js-click-exempt')) {
			$('.dropdown-menu, .list-item-dropdown-menu').fadeOut(100);
		}
	},

	// Dropdown Button
	'click .js-dropdown'(event) {
		event.preventDefault();
		let menuId = $(event.currentTarget).attr('data-menu');

		$('.dropdown-menu, .list-item-dropdown-menu').not(menuId).fadeOut(100);

		if ($(menuId).is(':visible')) {
			$(menuId).fadeOut(100);
			$(menuId).removeAttr('style');
		} else {
			let maxMenuHeight = $('#__blaze-root').height() - 118;
			$(menuId).css({maxHeight: maxMenuHeight}).fadeIn(200);
		}
	},
});