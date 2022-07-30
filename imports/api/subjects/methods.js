import {Subjects} from './subjects.js';
import {SchoolWork} from '../schoolWork/schoolWork.js';
import {Lessons} from '../lessons/lessons.js';

import _ from 'lodash'

Meteor.methods({
    insertSubject: function(subjectProperties) {
        const subjectId = Subjects.insert(subjectProperties);
        return subjectId;
    },

    updateSubject: function(subjectProperties) {
        Subjects.update(subjectProperties._id, {$set: subjectProperties});
    },

    deleteSubject: function(subjectId) {
		Subjects.remove({_id: subjectId});
		SchoolWork.remove({subjectId: subjectId});
		Lessons.remove({subjectId: subjectId});
	},
});