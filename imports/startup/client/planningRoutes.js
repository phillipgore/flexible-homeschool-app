import _ from 'lodash'

// Students
FlowRouter.route('/planning/students/new/:selectedFramePosition', {
	name: 'studentsNew',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'studentsList',
			frameThree: 'studentsNew',
		});
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'studentsNew')
		}
	},
});

FlowRouter.route('/planning/students/view/:selectedFramePosition/:selectedStudentId', {
	name: 'studentsView',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'studentsList',
			frameThree: 'studentsView',
		});
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'studentsView')
		}
	},
});

FlowRouter.route('/planning/students/edit/:selectedFramePosition/:selectedStudentId', {
	name: 'studentsEdit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'studentsList',
			frameThree: 'studentsEdit',
		});
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'studentsEdit')
		}
	},
});




// School Years
FlowRouter.route('/planning/schoolyears/new/:selectedFramePosition', {
	name: 'schoolYearsNew',
	action(params) {
		LocalTerms.remove();
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'schoolYearsList',
			frameThree: 'schoolYearsNew',
		});
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'schoolYearsNew')
		}
	},
});

FlowRouter.route('/planning/schoolyears/view/:selectedFramePosition/:selectedSchoolYearId', {
	name: 'schoolYearsView',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'schoolYearsList',
			frameThree: 'schoolYearsView',
		});
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'schoolYearsView')
		}
	},
});

FlowRouter.route('/planning/schoolyears/edit/:selectedFramePosition/:selectedSchoolYearId', {
	name: 'schoolYearsEdit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'schoolYearsList',
			frameThree: 'schoolYearsEdit',
		});
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'schoolYearsEdit')
		}
	},
});




// School Work
FlowRouter.route('/planning/schoolWork/new/:selectedFramePosition/:selectedStudentId/:selectedSchoolYearId', {
	name: 'schoolWorkNew',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkNewList',
			frameThree: 'schoolWorkNew',
		});
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'schoolWorkNew')
		}
	},
});

FlowRouter.route('/planning/schoolWork/view/:selectedFramePosition/:selectedStudentId/:selectedSchoolYearId/:selectedSchoolWorkId', {
	name: 'schoolWorkView',
	action(params) {
		BlazeLayout.render('app', {
			subbar: 'subbarSchoolWork',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkList',
			frameThree: 'schoolWorkView',
		});
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'schoolWorkView')
		}
	},
});

FlowRouter.route('/planning/schoolWork/edit/:selectedFramePosition/:selectedStudentId/:selectedSchoolYearId/:selectedSchoolWorkId', {
	name: 'schoolWorkEdit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkList',
			frameThree: 'schoolWorkEdit',
		});
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'schoolWorkEdit')
		}
	},
});




// Resources
FlowRouter.route('/planning/resources/new/:selectedFramePosition/:selectedResourceType/:selectedResourceAvailability/:selectedResourceNewType', {
	name: 'resourcesNew',
	action: function(params) {
		BlazeLayout.render('app', {
			subbar: 'subbarResources',
			frameOne: 'planningList',
			frameTwo: 'resourcesList',
			frameThree: 'resourcesNew',
		});
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'resourcesNew')
		}
	},
});


FlowRouter.route('/planning/resources/view/:selectedFramePosition/:selectedResourceType/:selectedResourceAvailability/:selectedResourceId/:selectedResourceCurrentTypeId', {
	name: 'resourcesView',
	action(params) {
		BlazeLayout.render('app', {
			subbar: 'subbarResources',
			frameOne: 'planningList',
			frameTwo: 'resourcesList',
			frameThree: 'resourcesView',
		});
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'resourcesView')
		}
	},
});

FlowRouter.route('/planning/resources/edit/:selectedFramePosition/:selectedResourceType/:selectedResourceAvailability/:selectedResourceId/:selectedResourceCurrentTypeId', {
	name: 'resourcesEdit',
	action: function(params, queryParams) {
		BlazeLayout.render('app', {
			subbar: 'subbarResources',
			frameOne: 'planningList',
			frameTwo: 'resourcesList',
			frameThree: 'resourcesEdit',
		});
		if (Meteor.settings.public.routeLoggingOn) {
			Meteor.call('logRoute', Meteor.userId(), 'resourcesEdit')
		}
	},
});







