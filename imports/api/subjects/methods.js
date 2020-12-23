import {Subjects} from './subjects.js';

import _ from 'lodash'

Meteor.methods({
    insertSubject: function(currentStudentId, studentIds, subjectProperties) {
        let groupId = Meteor.user().info.groupId;
        let userId = Meteor.userId();

        let bulkSubjects = [];

        studentIds.forEach(function(studentId) { 
			bulkSubjects.push({insertOne: {"document": {
				_id: Random.id(),
				name: subjectProperties.name,
				studentId: studentId,
				schoolYearId: subjectProperties.schoolYearId,
				scheduledDays: subjectProperties.scheduledDays,
				groupId: groupId, 
				userId: userId, 
				createdOn: new Date()
			}}});
		});

        let result = Subjects.rawCollection().bulkWrite(
			bulkSubjects
		).then((subjects) => {
            let subjectIds = _.values(subjects.insertedIds);
            let currentSubjectId = Subjects.findOne({_id: {$in: subjectIds}, studentId: currentStudentId})._id;
            console.log(currentSubjectId);
            return currentSubjectId;
        }).catch((error) => {
			throw new Meteor.Error(500, error);
        });

        return result;
    }
});