// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});

var userId;
var securityToken;

// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();

  //$$("#dashboardLink").click();

  /*var mainView = app.views.create('.view-main', {
    url: '/dashboard/'
  });*/
  app.request({
    url: 'http://35.200.224.144:8090/api/v1/login',
    //headers: {Authorization: "Bearer "},
    method: 'POST',
    dataType: 'json',
    data: {emailId: username, password: password},
    success: function (data, status, xhr) {
    //console.log(data);
    //console.log(status);
    //console.log(xhr.getResponseHeader('authorization'));
    //console.log(xhr.getResponseHeader('pragma'));
    userId = data.user.id;
    securityToken = data.user.token;
    $$('#my-login-screen [name="username"]').val('');
    $$('#my-login-screen [name="password"]').val('');
    $$("#dashboardLink").click();
  }});
  //var mainView = app.addView('.view-main')

// Load page from about.html file to main View:
  //mainView.router.loadPage('pages/dashboard.html');
  // Close login screen
  //app.loginScreen.close('#my-login-screen');

  // Alert username and password
  //app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
});
$$(document).on('page:init', '.page[data-name="dashboard"]', function (e)
{
  //alert(userId);
  //alert(securityToken);
  $$("#testLink").on('click', function()
  {
    //app.dialog.alert('JS Dialog Alert works.','Notice');
    /*var dialog =*/ //{//create({
      /*text:*/
      //close: true,
      //buttonOk: 'Close',
       /*'Notice');
      /*on: {
        opened: function () {
          console.log('Dialog opened');
        }
      }
    });
    //dialog.open();
    //var test = app.dialog.get(el);
    //test.open();*/
  });
});
$$(document).on('page:init', '.page[data-name="update"]', function (e)
{
  $$("#updateStatusSubmit").on('click', function()
  {
    //var text = $$('#updateStatusSelect').find('option').eq($$('#updateStatusSelect').index()).text();
    app.dialog.alert('Order ID '+$$('#updateOrderId').val()+' set to ('+$$('#updateStatusSelect').val()+')','Placeholder Notice');
  });
});
$$(document).on('page:init', '.page[data-name="form"]', function (e)
{
    app.request({
      url: 'http://35.200.224.144:8090/api/v1/categories',
      method: 'GET',
      dataType: 'json',
      success: function (data, status, xhr) {
      //alert(JSON.stringify(data));
      for (var i = 0; i < data.data.length; i++)
      {
        $$('#category').append($$('<option>', {'value': data.data[i].categoryId}).html(data.data[i].categoryName));
      }
    }});
});
