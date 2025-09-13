module.exports = {
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
      ratelimit: {
        enabled: true,
        max: 10,
        duration: 60000,
      },
    },
  },
};
