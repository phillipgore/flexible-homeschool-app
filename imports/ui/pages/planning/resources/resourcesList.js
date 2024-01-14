import {Template} from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Resources } from '../../../../api/resources/resources.js';
import './resourcesList.html';

import _ from 'lodash'

Template.resourcesList.onCreated( function() {
	let template = Template.instance();

	Session.set('initialLoading', true)
	Session.set('resourceLimit', 100)

	template.searchQuery = new ReactiveVar();
	template.searching   = new ReactiveVar( false );
	
	template.autorun(() => {
		this.resourceStats = this.subscribe('resourceStats');
		this.resourceData = template.subscribe( 'scopedSearchResources', FlowRouter.getParam('selectedResourceType'), FlowRouter.getParam('selectedResourceAvailability'), template.searchQuery.get(), Session.get('resourceLimit'), () => {
		  setTimeout( () => {
			template.searching.set( false );
			Session.set('initialLoading', false);
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
	initialLoading() {
		return Session.get('initialLoading');
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
		if (availability === 'returned') {
			return 'txt-danger'
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
		if (availability === 'returned') {
			return '(Returned It)'
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

	showLoadMore: function(type, availability) {
		if (Counts.get(type + _.capitalize(availability) + 'Count') === Resources.find().count() || Template.instance().searchQuery.get()) {
			return false;
		}
		return true;
	},
});

Template.resourcesList.events({
	'click .js-resouce-availability-btn'(event) {
		event.preventDefault();

		let resourceId = $(event.currentTarget).attr('data-resource-id');
		let resourceType = $(event.currentTarget).attr('data-resource-type');
		let selectedAvailability = $(event.currentTarget).attr('id');

		$('#resource' + resourceId).find('.list-item-dropdown').hide();
		$('#resource' + resourceId).find('.list-item-dropdown-loader').show();

		const resourceProperties = {
			availability: selectedAvailability,
		};

		function nextResourceId(currentResourceAvailability, newResourceId, newResourceType) {
			if (currentResourceAvailability != 'all' && newResourceId === FlowRouter.getParam('selectedResourceId')) {
				let resourceIds = Resources.find({}, {sort: {title: 1}}).map(resource => (resource._id));

				if (resourceIds.length > 1) {
					let selectedIndex = resourceIds.indexOf(newResourceId);
					if (selectedIndex) {
						return Resources.findOne({_id: resourceIds[selectedIndex - 1]});
					}
					return Resources.findOne({_id: resourceIds[selectedIndex + 1]});
				}
				return {_id: 'empty', type: 'empty'}
			}
			return {_id: FlowRouter.getParam('selectedResourceId'), type: FlowRouter.getParam('selectedResourceType')};
		};

		let returnResource = nextResourceId(FlowRouter.getParam('selectedResourceAvailability'), resourceId, resourceType)

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

				FlowRouter.go('/planning/resources/view/2/' + FlowRouter.getParam('selectedResourceType') +'/'+ FlowRouter.getParam('selectedResourceAvailability') +'/'+ returnResource._id +'/'+ returnResource.type );
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

	'click .js-load-more'(event) {
		event.preventDefault();

		let newLimit = Session.get('resourceLimit') + 100;
		Session.set('resourceLimit', newLimit)
	}
});