import {Groups} from '../../api/groups/groups.js';

import moment from 'moment';
import _ from 'lodash'

SyncedCron.add({
	name: 'Check for Expired Free Trials',
	schedule: function(parser) {
		return parser.text('every 12 hours');
	},
	job: function() {
		let freeTrialGroups = Groups.find({subscriptionStatus: 'freeTrial'})
		freeTrialGroups.map(group => {
			if (moment().isAfter(group.freeTrial.expiration)) {
				Groups.update(group._id, {$set: {subscriptionStatus: 'freeTrialExpired'}});
			}
		});
	}
});

// SyncedCron.add({
// 	name: 'Check for Account Status',
// 	schedule: function(parser) {
// 		return parser.text('every 1 minute');
// 	},
// 	job: function() {
// 		console.log('one minute');
// 	}
// });

SyncedCron.start();