# jForms

A package to create Bootstrap compatible forms with validation and filtering for NodeJS.

You can use this package with the ExpressJS framework or any other framework of your choice.

For validation and filtering, you can use the **validator** (npm install validator) package, it comes with several handy methods. You can also use your own functions of course.

This package was build in a quick and dirty way to suit my needs for several projects, and it's still a great way to get started. Any improvements or suggestions are welcome.

## Installation 


```
npm install jforms
```


## Using jForms


```javascript
var validator = require('validator'); // Not required but preferred since it comes with many validation functions
var jForms = require('jforms');

// Create the form
var myForm = new jForms({
	firstname: {
		label: 'firstname'
	},
	email: {
		label: "Email",
		required: true,
		filters: [
			validator.trim, 
			function(val){ // Custom filter
				return val.toLowerCase();
			}
		],
		validators: [
			validator.isEmail
		]
	},
	submit: {
		value: "Send",
		icon: "fa fa-check",
		className: "btn btn-primary"
	}
});

// Handle data
var data = { // Some dummy data to test against
	firstname: 'John Doe',
	email: 'john@doe.com'
};
myForm.handle(data, function(errors, filteredValues){
	if(errors){
		console.log("Invalid data");
	}
});
```

## Displaying the form
jForms has the **toString** method defined so you can just print out your form variable to display the form.

```
console.log(myForm);
// or
console.log(myForm.toString());
```


## Full example
```
var v = require('validator');
var jForms = require('jforms');

var formJSON = {
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

var myForm = new jForms(formJSON);

myForm.enctype = "multipart/form-data";
myForm.method = "post";
myForm.className = "form-horizontal";
myForm.leftSize = "col-sm-2"; // Size for label in horizontal forms
myForm.rightSize = "col-sm-10"; // Size for field in horizontal forms
myForm.id = "myForm";

console.log("Is form valid ? " + myForm.isValid); // Useless before calling 'handle' method
console.log("Was the form submitted ? " + myForm.isSubmitted);

myForm.handle(req.body, function(errors, values){
	if(errors){
		console.log("Invalid form");
	}
	else{
		// Save data maybe ?
	}      
});



```