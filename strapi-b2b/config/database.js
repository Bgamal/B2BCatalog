const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: path.join(__dirname, '..', 'database', 'data.db'),
    },
    useNullAsDefault: true,
    debug: false,
  },
});
