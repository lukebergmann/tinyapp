const { assert } = require('chai');
const checkEmail  = require('../checkEmail');


const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('checkEmail', function() {
  it('should return a user with valid email', function() {
    const user = checkEmail(testUsers, "user@example.com");
    const expectedOutput = true;
    assert.equal(user, expectedOutput);
  });
  it('should return undefined if a non-valid email is passed in', function() {
    const user = checkEmail(testUsers, "uuuuuuuuuuuser@example.com");
    const expectedOutput = false;
    assert.equal(user, expectedOutput);
  });
});

