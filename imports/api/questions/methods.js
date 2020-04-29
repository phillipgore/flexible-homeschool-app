import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Questions} from './questions.js';
import _ from 'lodash';

Meteor.methods({
	getInitialQuestionId: function() {
		let initialQuestion = Questions.findOne({active: true}, {sort: {order: 1}});
		if (initialQuestion) {
			return initialQuestion._id
		}
		return 'empty';
	}
})