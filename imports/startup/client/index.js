import './triggers.js';
import './userRoutes.js';
import './planningRoutes.js';
import './trackingRoutes.js';
import './reportingRoutes.js';
import './settingsRoutes.js';

import moment from 'moment';

Template.registerHelper('dateFormat', (date) => {
  return moment.utc(date).format('MMMM D, YYYY');
});

Template.registerHelper('shortDateFormat', (date) => {
  return moment.utc(date).format('M/D/YY');
});

Template.registerHelper('stripeDateFormat', (date) => {
  return moment.unix(date).format('M/D/YY');
});

Template.registerHelper('age', (date) => {
  return moment().diff(date, 'years');
});

Template.registerHelper('centsToDollars', ( cents ) => {
  return '$' + (cents / 100).toFixed(2);
});