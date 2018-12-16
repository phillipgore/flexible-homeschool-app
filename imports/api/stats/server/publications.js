import {Groups} from '../../groups/groups.js';
import {Counts} from 'meteor/tmeasday:publish-counts';
import {Students} from '../../students/students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Resources} from '../../resources/resources.js';
import {SchoolWork} from '../../schoolWork/schoolWork.js';
import {Weeks} from '../../weeks/weeks.js';
import {Lessons} from '../../lessons/lessons.js';
import {Reports} from '../../reports/reports.js';
import {studentSchoolYearsStatusAndPaths} from '../../../modules/server/functions';
import {allSchoolYearsStatusAndPaths} from '../../../modules/server/functions';

import _ from 'lodash'

Meteor.publish('initialIds', function(currentYear) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let ids = {};

		let userId = Meteor.users.findOne({'info.groupId': groupId, 'emails.0.verified': true, 'status.active': true}, {sort: {'info.lastName': 1, 'info.firstName': 1}})._id;
		let studentIds = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}}).map((student) => (student._id))


		// Intiial Student
		if (studentIds.length) {ids.studentId = studentIds[0]} else {ids.studentId = 'empty'};


		// Initial School Year
		function schoolYearId(currentYear) {
			if (!SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}).count()) {
				return 'empty'
			}
			if (SchoolYears.findOne({groupId: groupId, startYear: {$gte: currentYear}, deletedOn: { $exists: false }}, {sort: {starYear: 1}})) {
				return SchoolYears.findOne({groupId: groupId, startYear: {$gte: currentYear}, deletedOn: { $exists: false }}, {sort: {starYear: 1}})._id;
			}
			return SchoolYears.findOne({groupId: groupId, startYear: {$lte: currentYear}, deletedOn: { $exists: false }}, {sort: {starYear: 1}})._id;

		};
		ids.schoolYearId = schoolYearId(currentYear);


		// Initial Resources
		let valueResource = Resources.findOne({groupId: groupId, deletedOn: { $exists: false }}, {sort: {title: 1}});
		if (valueResource) {ids.resourceId = valueResource._id} else {ids.resourceId = 'empty'};
		if (valueResource) {ids.resourceType = valueResource.type} else {ids.resourceType = 'empty'};


		// Initial Terms and Weeks
		if (ids.schoolYearId === 'empty') {
			ids.termId = 'empty';
			ids.weekId = 'empty';
		} else {
			let initialSchoolYear = SchoolYears.findOne({_id: ids.schoolYearId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {startYear: 1, endYear: 1}});		
			
			let schoolWorkIds = SchoolWork.find({ 
				studentId: ids.studentId, 
				schoolYearId: initialSchoolYear._id, 
				deletedOn: { $exists: false }
			}).map(schoolWork => (schoolWork._id));
			let lessons = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }}, {fields: {completed: 1, assigned: 1, weekId: 1}}).fetch();
			let schoolYear = studentSchoolYearsStatusAndPaths(ids.studentId, initialSchoolYear, lessons);

			let valueTerm = schoolYear.firstTermId;
			if (valueTerm) {ids.termId = valueTerm} else {ids.termId = 'empty'};

			let valueWeek = schoolYear.firstWeekId;
			if (valueWeek) {ids.weekId = valueWeek} else {ids.weekId = 'empty'};
		}

		// Initial School Work
		if (ids.schoolYearId === 'empty' || ids.termId === 'empty' || ids.weekId === 'empty') {
			ids.schoolWorkId = 'empty';
		} else {
			let valueSchoolWork = SchoolWork.findOne({groupId: groupId, schoolYearId: ids.schoolYearId, studentId: ids.studentId, deletedOn: { $exists: false }}, {sort: {name: 1}});
			if (valueSchoolWork) {ids.schoolWorkId = valueSchoolWork._id} else {ids.schoolWorkId = 'empty'};
		}


		// Initial User
		if (userId) {ids.userId = userId} else {ids.userId = 'empty'};


		let valueReport = Reports.findOne({groupId: groupId, deletedOn: { $exists: false }}, {sort: {title: 1}});
		// Initial User
		if (valueReport) {ids.reportId = valueReport._id} else {ids.reportId = 'empty'};

		// Initial Group
		if (Groups.findOne({_id: groupId}).appAdmin) {
			// let appAdminGroupId = Groups.find({appAdmin: true}, {fields: {_id: 1}}).map(group => group._id);
			// let initialGroupId = Meteor.users.findOne({'info.groupId': {$nin: appAdminGroupId}}, {sort: {'info.lastName': 1, 'info.firstName': 1}}).info.groupId;

			let initialGroupId = Groups.findOne({appAdmin: false}, {fields: {_id: 1}, sort: {createdOn: -1}})._id; 

			if (initialGroupId) {ids.groupId = initialGroupId} else {ids.groupId = 'empty'};
		}


		self.added('initialIds', Random.id(), ids);
		self.ready();
	});

});

Meteor.publish('initialStats', function() {
	if (!this.userId) {
		return this.ready();
	}
	
	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	Counts.publish(this, 'schoolYearCount', SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'studentCount', Students.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'resourceCount', Resources.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'schoolWorkCount', SchoolWork.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'reportCount', Reports.find({groupId: groupId, deletedOn: { $exists: false }}));	
	Counts.publish(this, 'userCount', Meteor.users.find({'info.groupId': groupId}));
});

Meteor.publish('resourceStats', function() {
	if (!this.userId) {
		return this.ready();
	}
	
	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	Counts.publish(this, 'allAllCount', Resources.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'bookAllCount', Resources.find({type: 'book', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'linkAllCount', Resources.find({type: 'link', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'videoAllCount', Resources.find({type: 'video', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'audioAllCount', Resources.find({type: 'audio', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'appAllCount', Resources.find({type: 'app', groupId: groupId, deletedOn: { $exists: false }}));

	Counts.publish(this, 'allOwnCount', Resources.find({availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'bookOwnCount', Resources.find({type: 'book', availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'linkOwnCount', Resources.find({type: 'link', availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'videoOwnCount', Resources.find({type: 'video', availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'audioOwnCount', Resources.find({type: 'audio', availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'appOwnCount', Resources.find({type: 'app', availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));

	Counts.publish(this, 'allBorrowedCount', Resources.find({availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'bookBorrowedCount', Resources.find({type: 'book', availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'linkBorrowedCount', Resources.find({type: 'link', availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'videoBorrowedCount', Resources.find({type: 'video', availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'audioBorrowedCount', Resources.find({type: 'audio', availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'appBorrowedCount', Resources.find({type: 'app', availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));

	Counts.publish(this, 'allNeedCount', Resources.find({availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'bookNeedCount', Resources.find({type: 'book', availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'linkNeedCount', Resources.find({type: 'link', availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'videoNeedCount', Resources.find({type: 'video', availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'audioNeedCount', Resources.find({type: 'audio', availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'appNeedCount', Resources.find({type: 'app', availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
});