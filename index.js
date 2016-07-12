var _ = require('lodash');
var randomstring = require("randomstring");


var jForms = function(formFields){
  this.fields = formFields;
  this.attribs = {}
  this.enctype = '';
  this.method = 'post';
  this.action = '';
  this.className = '';
  this.leftSize = 'col-sm-2';
  this.rightSize = 'col-sm-10';
  this.id = '';
  this.submit = {
    icon: '', // Used to display an icon inside the button
    value: 'Submit',
    className: 'btn btn-primary'
  };

  this.values = {};
  this.errors = {};
  this.valuesFiltered = {};
  this.isValid = true;
  this.isSubmitted = false;
};





jForms.prototype.handle = function(data, callback){
  var dataFiltered = {};
  var errors = {};
  var me = this;

  me.isSubmitted = true;
  me.values = data;



  _.forEach(me.fields, function(field, fname){
    if(field.name) fname = field.name; // Override field name if user has defined it
    if(fname == "submit") return;

    var message = "This field is invalid";
    if(field.message) message = field.message;
    var val = data && data.hasOwnProperty(fname) ? data[fname] : null;

    // Perform filter
    if(field.filters && _.isArray(field.filters)){
      _.forEach(field.filters, function(filter){
        try{
          val = filter(val);
        }
        catch(e){}
      });
    }

    // Perform validation
    if(field.required && field.required === true && (val == null || val == '')){ // Required state
      errors[fname] = message;
    }
    if(field.validators && _.isArray(field.validators) && val != null && val.length > 0){
      _.forEach(field.validators, function(validator){
        if(!validator(val)){
          errors[fname] = message;
        }
      });
    }


    dataFiltered[fname] = val;
  });

  me.valuesFiltered = dataFiltered;

  // Finished validation
  if(_.size(errors) < 1){
    this.isValid = true;
    errors = null;
  }
  else{
    this.isValid = false;
    this.errors = errors;
  }

  if(typeof callback == 'function'){

  }
  else{
    return {
      errors: errors,
      values: dataFiltered
    }
  }
  callback(errors, dataFiltered);
}



jForms.prototype.toString = function(){
  var template = '';
  var me = this;

  // Function to add attributes to elements
  var addAttribs = function(field){
    // Anything else will be added as attributes to fields
    var ignoreAttribs = [
      'label',
      'type',
      'value',
      'validators',
      'filters',
      'message',
      'className',
      'options',
      'required',
      'icon',
      'name'
    ];

    // Add class name
    if(!field.type || (field.type != "radio" && field.type != "checkbox")){
      if(field.className) template += ' class="'+field.className+'"';
      else template += ' class="form-control"';
    }


    _.forEach(field, function(val, attr){
      if(_.indexOf(ignoreAttribs, attr) > -1) return;
      template += ' '+attr+'="'+val+'"';
    });
  };

  template += '<form action="'+this.action+'" method="'+this.method+'"';
    if(this.enctype != '') template += ' enctype="'+this.enctype+'"';
    if(this.className != '') template += ' class="'+this.className+'"';
    if(this.id != '') template += ' id="'+this.id+'"';
    _.forEach(me.attribs, function(v, k){
      template += ' '+k+'="'+v+'"';
    });
  template += '>';



  // Displaying fields
  _.forEach(this.fields, function(field, fname){
    if(fname == "submit") return;

    var fieldValue = me.isSubmitted === false && field.value ? field.value : "";

    if(!field.name){
      field.name = fname;
    }

    if(!field.id){
      field.id = 'form-'+field.name+'-'+randomstring.generate(8);
    }

    if(me.isSubmitted === true && me.valuesFiltered[field.name]){
      fieldValue = me.values[field.name];
    }
    else if(me.values[field.name]){
      fieldValue = me.values[field.name];
    }


    template += '<div class="form-group';
    if(me.isSubmitted === true){
      template += me.errors[field.name] ? ' has-error' : ' has-success';
    }
    template += '">';

    // Label
    if(field.label && field.label != "") template += '<label class="control-label'+(me.className == "form-horizontal" ? ' '+me.leftSize : '')+'" for="'+field.id+'">'+field.label+'</label>';

    if(me.className == "form-horizontal"){
      template += '<div class="'+me.rightSize+'">';
    }

    // Text area
    if(field.type && field.type == "textarea"){
      template += '<textarea name="'+field.name+'"';
        addAttribs(field);
      template += '>';
      if(fieldValue != "") template += fieldValue;
      template += '</textarea>';
    }
    // Select
    else if(field.type && field.type == "select"){
      template += '<select name="'+field.name+'"';
        addAttribs(field);
      template += '>';
        if(field.options){
          _.forEach(field.options, function(val, key){
            template += '<option value="'+key+'"'+(fieldValue == key ? ' selected="selected"' : '')+'>'+val+'</option>';
          });
        }
      template += '</select>';
    }
    // Radio
    else if(field.type && field.type == "radio"){
        if(field.options){
          _.forEach(field.options, function(val, key){
            template += '<div class="radio">';
              template += '<label>';
                template += '<input type="radio" name="'+field.name+'" value="'+key+'"'+(fieldValue == key ? ' checked' : '');
                addAttribs(field);
                template += '>'+val;
              template += '</label>';
            template += '</div>';
          });
        }
    }
    // Checkbox
    else if(field.type && field.type == "checkbox"){
        if(field.options){
          _.forEach(field.options, function(val, key){
            var checked = [];
            if(field.value && _.isArray(field.value))
              checked = field.value;
            else if(field.value && _.isString(field.value))
              checked = field.value.split(',');

            template += '<div class="checkbox">';
              template += '<label>';
                template += '<input type="checkbox" name="'+field.name+'" value="'+key+'"'+(_.indexOf(checked, key) > -1 ? ' checked' : '');
                addAttribs(field);
                template += '>'+val;
              template += '</label>';
            template += '</div>';
          });
        }
    }
    // Password
    else if(field.type && field.type == "password"){
      template += '<input type="password" name="'+field.name+'"';
        if(fieldValue != "") template += ' value="'+fieldValue+'"';
        addAttribs(field);
      template += '>';
    }
    // Hidden
    else if(field.type && field.type == "hidden"){
      template += '<input type="hidden" name="'+field.name+'"';
        if(fieldValue != "") template += ' value="'+fieldValue+'"';
        addAttribs(field);
      template += '>';
    }
    // Text input
    else{
      template += '<input type="text" name="'+field.name+'"';
        if(fieldValue != "") template += ' value="'+fieldValue+'"';
        addAttribs(field);
      template += '>';
    }


    if(me.errors[field.name]){
      template += '<p class="help-block">'+me.errors[field.name]+'</p>';
    }


    if(me.className == "form-horizontal"){
      template += '</div>';
    }

    template += '</div>';
  });


  // Submit button
  var btnSubmit = this.fields.submit || this.submit;
  if(btnSubmit){
    btnSubmit.type = "submit";
  }
  template += '<div class="form-group form-submit">';
    if(me.className == "form-horizontal"){
      template += '<div class="'+me.leftSize+'">';
      template += '</div>';
      template += '<div class="'+me.rightSize+'">';
    }
    template += ' <button type="submit"';
    addAttribs(btnSubmit);
    template += '>';

    if(btnSubmit.icon && btnSubmit.icon != ''){
      template += '<i class="'+btnSubmit.icon+'"></i> ';
    }

    template +=     btnSubmit.value;
    template += ' </button>';
    if(me.className == "form-horizontal"){
      template += '</div>';
    }
  template += '</div>';


  template += '</form>';


  return template;
}


module.exports = jForms;
