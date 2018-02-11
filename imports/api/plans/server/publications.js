import {Plans} from '../plans.js';

Meteor.publish('allPlans', function() {
	return Plans.find();
});