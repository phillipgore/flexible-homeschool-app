import {Subjects} from './subjects.js';

import _ from 'lodash'

Meteor.methods({
    insertSubject: function(subjectProperties) {
        const subjectId = Subjects.insert(subjectProperties);
        return subjectId;
    },

    updateSubject: function(subjectProperties) {
        Subjects.update(subjectProperties._id, {$set: subjectProperties});
    }
});