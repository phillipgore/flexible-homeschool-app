import {SchoolYears} from '../schoolYears.js';
import {Students} from '../../students/students.js';
import {Terms} from '../../terms/terms.js';
import {Weeks} from '../../weeks/weeks.js';
import {SchoolWork} from '../../schoolWork/schoolWork.js';
import {Resources} from '../../resources/resources.js';
import {Lessons} from '../../lessons/lessons.js';
import {allSchoolYearsStatusAndPaths} from '../../../modules/server/functions';
import {studentSchoolYearsStatusAndPaths} from '../../../modules/server/functions';
import _ from 'lodash'

Meteor.publish('allSchoolYears', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {startYear: 1, endYear: 1}});
});

Meteor.publish('allSchoolYearsPath', function() {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let schoolYears = SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {startYear: 1, endYear: 1}});

		schoolYears.map((schoolYear) => {
			schoolYear = allSchoolYearsStatusAndPaths(schoolYear, schoolYear._id);
			self.added('schoolYears', schoolYear._id, schoolYear);
		});

		self.ready();
	});
});

Meteor.publish('studentSchoolYearsPath', function(studentId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let schoolYears = SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {startYear: 1, endYear: 1}});

		schoolYears.map((schoolYear) => {
			schoolYear = studentSchoolYearsStatusAndPaths(schoolYear, schoolYear._id, studentId);
			self.added('schoolYears', schoolYear._id, schoolYear);
		});

		self.ready();
	});
});

Meteor.publish('schoolYearView', function(schoolYearId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let schoolYear = SchoolYears.findOne({groupId: groupId, deletedOn: { $exists: false }, _id: schoolYearId}, {fields: {startYear: 1, endYear: 1}});
		let terms = Terms.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId});

		termStats = []

		terms.forEach((term) => {
			let weekCount = Weeks.find({groupId: groupId, deletedOn: { $exists: false }, termId: term._id}).count();
			if (!_.find(termStats, { 'termOrder': term.order, 'weekCount': weekCount })) {
				termStats.push({termOrder: term.order, weekCount: weekCount})
			}	
		})

		if (schoolYear) {
			schoolYear.termStats = _.uniq(termStats);
			self.added('schoolYears', schoolYear._id, schoolYear);
		}

		self.ready();
	});
});

Meteor.publish('schoolYearComplete', function(schoolYearId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	let termIds = Terms.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId}).map(term => term._id);
	let weekIds = Weeks.find({groupId: groupId, deletedOn: { $exists: false }, termId: {$in: termIds}}).map(week => week._id);

	return [
		SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }, _id: schoolYearId}),
		Terms.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId}, {sort: {order: 1}, fields: {order: 1}}),
		SchoolWork.find(
			{groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId}, 
			{sort: {name: 1}, fields: {schoolYearId: 1, name: 1}}
		),
		Weeks.find({groupId: groupId, deletedOn: { $exists: false }, termId: {$in: termIds}}, {sort: {order: 1}, fields: {order: 1, termId: 1}}),
		Lessons.find({groupId: groupId, deletedOn: { $exists: false }, weekId: {$in: weekIds}}, {sort: {order: 1}, fields: {schoolWorkId: 1, weekId: 1, completedOn: 1, completionTime: 1, description: 1}}),
	];
});

Meteor.publish('schoolYearEdit', function(schoolYearId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let schoolYears = SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }, _id: schoolYearId}, {fields: {startYear: 1, endYear: 1}});
		let terms = Terms.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}});	
		let schoolWork = SchoolWork.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId});	
		let termIds = Terms.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId}).map(term => term._id);

		schoolYears.map((schoolYear) => {
			schoolYear.weeksPerYear = Weeks.find({groupId: groupId, deletedOn: { $exists: false }, termId: {$in: termIds}}).count();
			self.added('schoolYears', schoolYear._id, schoolYear);
		});

		terms.map((term) => {
			let weekIds = Weeks.find({groupId: groupId, deletedOn: { $exists: false }, termId: term._id}).map(week => week._id);
			let lessonCount = Lessons.find({groupId: groupId, deletedOn: { $exists: false }, weekId: {$in: weekIds}}).count();
			let deletableLessonCount = Lessons.find({groupId: groupId, deletedOn: { $exists: false }, weekId: {$in: weekIds}, $and: [{completed: null, completedOn: null, completionTime: null, description: null}]}).count();

			let schoolWorkLessonCount = [];
			schoolWork.forEach((work) => {
				let count = Lessons.find({schoolWorkId: work._id, weekId: {$in: weekIds}}).count()
				schoolWorkLessonCount.push(count);
			});
			
			term.weeksPerTerm = Weeks.find({groupId: groupId, deletedOn: { $exists: false }, termId: term._id}).count();
			term.lessonCount = lessonCount;
			term.minLessonCount = Math.max(...schoolWorkLessonCount);
			term.isDeletable = lessonCount === deletableLessonCount;
			term.undeletableLessonCount = lessonCount - deletableLessonCount;
			self.added('terms', term._id, term);
		});

		self.ready();
	});
});









