import {Template} from 'meteor/templating';
import { Resources } from '../../../../api/resources/resources.js';
import './resourcesEach.html';

import _ from 'lodash'

Template.resourcesEach.onCreated( function() {
	Session.setPersistent('unScrolled', true);
});

Template.resourcesEach.onRendered( function() {
	
});

Template.resourcesEach.helpers({
	scroll: function() {
		if (Session.get('unScrolled') && Resources.find({_id: FlowRouter.getParam('selectedResourceId')}).count()) {
			setTimeout(function() {
				let newScrollTop = document.getElementById(FlowRouter.getParam('selectedResourceId')).getBoundingClientRect().top - 180;
				if (window.screen.availWidth > 640) {
					document.getElementsByClassName('frame-two')[0].scrollTop = newScrollTop;
				}
				Session.setPersistent('unScrolled', false);
				return false;
			}, 100);
		}
	},

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





