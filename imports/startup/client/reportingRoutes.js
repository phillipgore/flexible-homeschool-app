import _ from 'lodash'

FlowRouter.route('/reporting/list/:selectedSchoolYearId/:selectedStudentId', {
	name: 'reportingList',
	action() {
		BlazeLayout.reset();
		BlazeLayout.render('app', {
			frameOne: 'reportingList',
		});
	},
});

FlowRouter.route('/reporting/settings/edit', {
	name: 'reportingSettingsEdit',
	action() {
		BlazeLayout.render('app', {
			frameOne: 'reportingSettingsEdit',
		});
	},
});

