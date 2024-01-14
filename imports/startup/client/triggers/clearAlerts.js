import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Clear Alerts.
function clearAlerts(context) {
	Alerts.remove({});
};


FlowRouter.triggers.enter([clearAlerts]);