'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: '54.148.12.178',
  SESSION_SECRET: "woobee-secret",
  
  FACEBOOK_ID: '1444701762448090',
  FACEBOOK_SECRET: '489e958e732b1508b713b6350bfc5956',

  GOOGLE_ID: '333169757313-83aqelj0rlev7ltdf3ug06heqt7rd53n.apps.googleusercontent.com',
  GOOGLE_SECRET: '3mRzHSbL5qhtWepkD5abN3eG',
  
  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
