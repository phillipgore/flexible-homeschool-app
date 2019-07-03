import {Template} from 'meteor/templating';
import { Stats } from '../../../api/stats/stats.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import { SchoolWork } from '../../../api/schoolWork/schoolWork.js';
import { Lessons } from '../../../api/lessons/lessons.js';
import { Terms } from '../../../api/terms/terms.js';
import { Weeks } from '../../../api/weeks/weeks.js';
import { Notes } from '../../../api/notes/notes.js';

import moment from 'moment';
import _ from 'lodash'
import './trackingEditSchoolWork.html';

Template.trackingEditSchoolWork.helpers({
	workLessons: function(schoolWorkId) {
		return Lessons.find({schoolWorkId: schoolWorkId});
	},

	workLessonsExist: function(schoolWorkId) {
		let lessonsCount = Lessons.find({schoolWorkId: schoolWorkId, weekId: FlowRouter.getParam('selectedWeekId')}).count();
		if (lessonsCount) {
			return true;
		}
		return false;
	},

	workLocalLessons: function(schoolWorkId) {
		return LocalLessons.find({schoolWorkId: schoolWorkId});
	},

	lessonCount: function(schoolWorkId) {
		return Lessons.find({schoolWorkId: schoolWorkId}).count() + LocalLessons.find({schoolWorkId: schoolWorkId}).count();
	},

	lessonLimitReached: function(schoolWorkId) {
		let lessonCount = Lessons.find({schoolWorkId: schoolWorkId}).count() + LocalLessons.find({schoolWorkId: schoolWorkId}).count();

		if (lessonCount < 7) {
			return false;
		}
		return true;
	},

	lessonStatus: function(lesson, schoolWorkId) {
		$('.js-lesson-updating').hide();
		let lessons = Lessons.find({schoolWorkId: schoolWorkId}).fetch();

		if (!_.some(lessons, ['completed', false])) {
			return 'btn-primary-light';
		}
		if (lesson.completed) {
			return 'btn-secondary-light';
		}
		if (lesson.assigned) {
			return 'btn-warning-light';
		}

		return 'btn-gray-dark';
	},

	hasNote: function(schoolWorkId) {
		let note = Notes.findOne({schoolWorkId: schoolWorkId, weekId: FlowRouter.getParam('selectedWeekId')}) && Notes.findOne({schoolWorkId: schoolWorkId, weekId: FlowRouter.getParam('selectedWeekId')})
		if (_.isUndefined(note)) {
			return false
		}
		if (note.note) {
			return true;
		}
		return false;
	},

	isEdit: function() {
		let action = Session.get('action')
		if (action === 'choose' || action === 'insert' ) {
			return false;
		}
		return true;
	},

	isInsert: function() {
		let action = Session.get('action')
		if (action === 'insert' ) {
			return true;
		}
		return false;
	},
});

Template.trackingEditSchoolWork.events({
	'change .js-checkbox'(event) {
	    if ($(event.currentTarget).val() === 'true') {
	    	$(event.currentTarget).val('false');
	    } else {
	    	$(event.currentTarget).val('true');
	    }
	},
});





