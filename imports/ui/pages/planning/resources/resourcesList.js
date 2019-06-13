import {Template} from 'meteor/templating';
import { Resources } from '../../../../api/resources/resources.js';
import './resourcesList.html';

import _ from 'lodash'

Template.resourcesList.onCreated( function() {
	let template = Template.instance();

	template.searchQuery = new ReactiveVar();
	template.searching   = new ReactiveVar( false );
	
	template.autorun(() => {
		this.resourceStats = this.subscribe('resourceStats');
		this.resourceData = template.subscribe( 'scopedSearchResources', FlowRouter.getParam('selectedResourceType'), FlowRouter.getParam('selectedResourceAvailability'), template.searchQuery.get(), () => {
		  setTimeout( () => {
		    template.searching.set( false );
		  }, 500 );
		});
	});

	Meteor.call('getInitialResourceIds', function(error, result) {
		Session.set('initialResourceIds', result);

		let initialResourceIds = Session.get('initialResourceIds')
		if (!Session.get('selectedResourceType')) {
			Session.set('selectedResourceType', 'all');
		}

		if (!Session.get('selectedResourceAvailability')) {
			Session.set('selectedResourceType', 'all');
		}

		if (!Session.get('selectedResourceId')) {
			Session.set('selectedResourceId', initialResourceIds.resourceAllAll);
		}

		if (!Session.get('selectedResourceCurrentTypeId')) {
			Session.set('selectedResourceCurrentTypeId', 'all');
		}
	});

	Session.set('selectedResourceAvailability', FlowRouter.getParam('selectedResourceAvailability'));
	Session.set('selectedResourceType', FlowRouter.getParam('selectedResourceType'));
});

Template.resourcesList.onRendered( function() {
	Session.set({
		labelTwo: 'Resources',
		activeNav: 'planningList',
	});
});

Template.resourcesList.helpers({
	subscriptionReady: function() {
		return Template.instance().resourceData.ready();
	},

	searching() {
		return Template.instance().searching.get();
	},

	query() {
		return Template.instance().searchQuery.get();
	},

	resources: function() {
		let resources = Resources.find({}, {sort: {title: 1}});
		if (resources) {
			return resources;
		}
	},

	selectedResourceType: function() {
		return FlowRouter.getParam('selectedResourceType');
	},

	selectedResourceAvailability: function() {
		return FlowRouter.getParam('selectedResourceAvailability');
	},

	selectedResourceId: function() {
		return FlowRouter.getParam('selectedResourceId');
	},

	selectedResourceCurrentTypeId: function() {
		return FlowRouter.getParam('selectedResourceCurrentTypeId');
	},

	selectedResourceNewType: function() {
		return Session.get('selectedResourceNewType')
	},

	resourceCount: function(type, availability) {
		return Counts.get(type + _.capitalize(availability) + 'Count');
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

	activeRoute: function(currentRoute, route) {
		if (currentRoute === route) {
			return true;
		}
		return false;
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedResourceId') === id) {
			return true;
		}
		return false;
	},
});

Template.resourcesList.events({
	'click .js-resouce-availability-btn'(event) {
		event.preventDefault();

		let resourceId = $(event.currentTarget).attr('data-resource-id');
		let selectedAvailability = $(event.currentTarget).attr('id');

		$('#resource' + resourceId).find('.list-item-dropdown').hide();
		$('#resource' + resourceId).find('.list-item-dropdown-loader').show();

		const resourceProperties = {
			availability: selectedAvailability,
		};

		Meteor.call('updateResource', resourceId, resourceProperties, function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
				
				$('#resource' + resourceId).find('.list-item-dropdown-loader').hide();
				$('#resource' + resourceId).find('.list-item-dropdown').show();
			} else {
				$('#dropdown' + resourceId).fadeOut(100).removeAttr('style');
				$('#resource' + resourceId).find('.list-item-dropdown-loader').hide();
				$('#resource' + resourceId).find('.list-item-dropdown').show();

				FlowRouter.go('/planning/resources/view/2/' + FlowRouter.getParam('selectedResourceType') +'/'+ FlowRouter.getParam('selectedResourceAvailability') +'/'+ FlowRouter.getParam('selectedResourceId') +'/'+ FlowRouter.getParam('selectedResourceCurrentTypeId') );
			}
		});

		return false;
	},

	'keyup #search-resources'(event, template) {
		let value = event.currentTarget.value.trim();

		if ( value !== '' ) {
			FlowRouter.go('/planning/resources/view/2/' + FlowRouter.getParam('selectedResourceType') +'/'+ FlowRouter.getParam('selectedResourceAvailability') +'/empty/empty' );
			template.searchQuery.set( value );
			template.searching.set( true );
		}

		if ( value === '' ) {
			template.searchQuery.set( value );
			FlowRouter.go('/planning/resources/view/2/' + FlowRouter.getParam('selectedResourceType') +'/'+ FlowRouter.getParam('selectedResourceAvailability') +'/'+ Session.get('selectedResourceId') +'/'+ Session.get('selectedResourceCurrentTypeId') );
		}
	},

	'click .js-clear-search'(event, template) {
		event.preventDefault();

		Alerts.remove({type: 'addResource'});
		$('#search-resources').val('');

		template.searchQuery.set('');
		template.searching.set(false);
		
		FlowRouter.go('/planning/resources/view/2/' + FlowRouter.getParam('selectedResourceType') +'/'+ FlowRouter.getParam('selectedResourceAvailability') +'/'+ Session.get('selectedResourceId') +'/'+ Session.get('selectedResourceCurrentTypeId') );
	},
});