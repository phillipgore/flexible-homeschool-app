import { Template } from "meteor/templating";
import "./officeDashboard.html";

Template.officeDashboard.onCreated(function()  {
  const template = Template.instance();

  template.autorun(() => {
    this.accountData = Meteor.subscribe("allAccountTotals");
  });
});

Template.officeDashboard.onRendered(() => {
  Session.set({
    labelOne: "Dashboard"
  });
});

Template.officeDashboard.helpers({
  subscriptionReady() {
    return Template.instance().accountData.ready();
  }
});
