var assert = require('chai').assert;
var jforms = require('../index.js');
var v = require('validator');
var schema = {
  firstname: {
    label: "First name",
    required: true,
    validators: [v.isAlpha],
    filters: [v.trim],
    message: "Please enter your first name",
    placeholder: "Your full name"
  },
  lastname: {
    label: "Last name",
    required: true,
    filters: [v.trim],
    message: "Please enter your last name"
  },
  password: {
    label: "Password",
    type: "password",
    required: true
  },
  message: {
    label: 'Message',
    value: 'Hello World',
    type: 'textarea',
    filters: [v.trim],
    rows: 10
  },
  gender: {
    label: 'Gender',
    type: 'radio',
    value: 'f',
    options: {
      m: 'Male',
      f: 'Female',
    }
  },
  color: {
    label: 'Color',
    type: 'checkbox',
    value: ['red', 'blue'],
    options: {
      red: 'Red',
      green: 'Green',
      blue: 'Blue',
    }
  },
  region: {
    label: 'City',
    type: 'select',
    value: 'ny',
    name: "city", // This will override the key used for this field
    options: {
      '': 'Select your region',
      ny: 'New York',
      cal: 'California',
    }
  },
  submit: {
    value: "Send message",
    className: "btn btn-primary",
    icon: 'fa fa-check'
  }
};

var form = new jforms(schema);

describe('Validate Schema', function() {

  describe('validate()', function() {
    it('should not throw errors when called with no arguments', function() {
      form.handle();
    });

    it('should not throw errors when called with empty or invalid data', function() {
      form.handle();
    });

    it('should not throw errors when called with no callback', function() {
      form.handle();
    });

    it('should return errors and filtered data when called with no callback', function() {
      var result = form.handle();

      assert.isObject(result, 'object');
      assert.property(result, 'errors');
      assert.property(result, 'values');
      assert.isObject(result.errors);
      assert.isObject(result.values);
    });

    it('should not have errors when provided with correct data', function() {
      var result = form.handle({
        firstname: 'John',
        lastname: 'Doe',
        password: 'HelloWorld'
      });

      assert.isNull(result.errors);
    });


    it('should validate and filter data', function() {
      var result = form.handle({
        firstname: '12345',
        lastname: 'Doe  ',
        password: 'HelloWorld'
      });

      assert(result.errors.firstname === 'Please enter your first name', 'value was not validated');
      assert.isFalse(result.values.lastname.endsWith(' '), 'value was not filtered');
    });


    it('should use callback when provided one', function(done) {
      form.handle({
        firstname: '12345',
        lastname: 'Doe  ',
        password: 'HelloWorld'
      }, function(errors, values){
        assert(errors.firstname === 'Please enter your first name', 'value was not validated');
        assert.isFalse(values.lastname.endsWith(' '), 'value was not filtered');
        done();
      });
    });
  });

});
