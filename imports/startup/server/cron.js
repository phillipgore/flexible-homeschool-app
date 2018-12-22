import {Groups} from '../../api/groups/groups.js';

import moment from 'moment';

SyncedCron.add({
	name: 'Check for expired Free Trials',
	schedule: function(parser) {
		// parser is a later.parse object
		return parser.text('at 12:00 am');
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

SyncedCron.start();