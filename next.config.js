const nextAuth = require('next-auth');

module.exports = {
  reactStrictMode: true,

  // Add the following code to enable JWT for session
  nextAuth: {
    session: {
      jwt: true,
    },
  },
};
