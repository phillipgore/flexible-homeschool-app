import './triggers.js';
import './userRoutes.js';
import './planningRoutes.js';
import './trackingRoutes.js';
import './reportingRoutes.js';
import './settingsRoutes.js';

import moment from 'moment';

Template.registerHelper( 'dateFormat', ( date ) => {
  return moment.utc(date).format('MMMM D, YYYY');
});

Template.registerHelper( 'centsToDollars', ( cents ) => {
  return '$' + (cents / 100).toFixed(0);
});