import {Students} from '../../students/students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';

Meteor.publish('planningStatusCounts', function() {
	if (!this.userId) {
		return this.ready();
	}
	
	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return [
		Students.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {_id: 1}}),
		SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {_id: 1}})
	]
});