requirejs.config({
    "baseUrl": "",
    "paths": {
      "template": "./static/libs/template/template",
      "jquery":"./static/libs/jquery/dist/jquery.min",
      "datetimepicker": "./static/libs/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min",
      'bootstrap': './static/libs/bootstrap/dist/js/bootstrap.min',
      "login":"./static/script/login",
      "operationHelper":"./static/script/operationHelper",
      "creativeHelper":"./static/script/creativeHelper",
    },
     shim: {
        'jquery': {
            exports: '$'
        },
        'template':{
            exports: 'template'
        },
        "datetimepicker":{
            deps: ['bootstrap']
        }
    }
});