import {Template} from 'meteor/templating';
import './resourcesEach.html';

Template.resourcesEach.onRendered( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		let resourcesScrollTop = document.getElementById(FlowRouter.getParam('selectedResourceId')).getBoundingClientRect().top - 130;
		if (window.screen.availWidth < 640 && FlowRouter.getParam('selectedFramePosition') == 2) {
			Session.set('resourcesScrollTop', resourcesScrollTop);
			$(window).scrollTop(resourcesScrollTop);
		} else {
			Session.set('resourcesScrollTop', resourcesScrollTop);
			document.getElementsByClassName('frame-two')[0].scrollTop = resourcesScrollTop;
		}
	});
});

Template.resourcesEach.helpers({
	selectedResourceType: function() {
		return FlowRouter.getParam('selectedResourceType');
	},

	selectedResourceAvailability: function() {
		return FlowRouter.getParam('selectedResourceAvailability');
	},

	isLink: function(type) {
		if (type === 'link') {
			return true;
		}
		return false;
	},

	availability: function(availability) {
		if (availability === 'own') {
			return 'txt-royal'
		}
		if (availability === 'borrowed') {
			return 'txt-info'
		}
		if (availability === 'need') {
			return 'txt-warning'
		}
	},

	availabilityText: function(availability) {
		if (availability === 'own') {
			return '(Own It)'
		}
		if (availability === 'borrowed') {
			return '(Borrowed It)'
		}
		if (availability === 'need') {
			return '(Need It)'
		}
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedResourceId') === id) {
			return true;
		}
		return false;
	},
});