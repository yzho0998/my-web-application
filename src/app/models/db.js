var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/groupData', { useNewUrlParser: true }, function () {
  console.log('mongodb connected')
});

module.exports = mongoose;