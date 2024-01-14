import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/tracking/students/view/:selectedFramePosition/:selectedStudentId/:selectedSchoolYearId/:selectedTermId/:selectedWeekId', {
	name: 'trackingView',
	title:  'Tracking: View',
	action(params) {
		BlazeLayout.render('app', {
			subbar: 'subbarTracking',
			frameOne: 'trackingList',
			frameTwo: 'trackingView',
		});
	},
});

FlowRouter.route('/tracking/students/edit/:selectedFramePosition/:selectedStudentId/:selectedSchoolYearId/:selectedTermId/:selectedWeekId', {
	name: 'trackingEdit',
	title:  'Tracking: Edit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: 'subbarTracking',
			frameOne: 'trackingList',
			frameTwo: 'trackingEdit',
		});
	},
});














