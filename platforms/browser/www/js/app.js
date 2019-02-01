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
var hashed;

loginStart();
$$(document).on('page:init', '.page[data-name="home"]', function (e)
{
  loginStart();
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
        $$('#category').append($$('<option>').attr({'value': data.data[i].categoryId, 'text': data.data[i].categoryName}));
      }
    }});
    $$('#feedback').hide();
    $$('#upload').on('click', function()
    {
        var dataPost = {
          "categoryId": $$('#category').val(),
          "categoryName": $$('#category').val(),
          "depth": $$('#depth').val(),
          "description": $$('#description').val(),
          "height": $$('#height').val(),
          "itemStatus": 1,
          "length": $$('#length').val(),
          "price": $$('#price').val(),
          "prodCondition": $$('#prodCondition').val(),
          "productName": $$('#name').val(),
          "publicationDate": new Date().toISOString().slice(0, 28),//19).replace('T', ' '),
          "sellerId":userId,
          "slug": $$('#name').val().toLowerCase().replace(' ', '-'),
          "stock": $$('#stock').val(),
          "type": $$('#type').val(),
          "weight": $$('#weight').val()
        };
        alert(JSON.stringify(dataPost));
        app.request({
          url: 'http://35.200.224.144:8090/api/v1/product',
          headers: {Authorization: "Bearer "+securityToken},
          method: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          data: '{"product":'+JSON.stringify(dataPost)+'}',
          success: function (data, status, xhr) {
          //alert(JSON.stringify(data));
            $$('#userForm').hide();
            $$('#feedback').show();
        }});
      });
});
$$(document).on('page:init', '.page[data-name="new-user"]', function (e)
{
  $$('#feedback').hide();
  $$('#register').on('click', function()
  {
      var salt = gensalt(12);
      hashpw($$('#pass').val(), salt, hashing);
  });
});
function hashing(hash)
{
  //alert('Hash is '+hash);
  //hashed = hash;

  var dataPost = {
    "address": $$('#address').val(),
    "alias": $$('#alias').val(),
    /*"authorities": {
      "authority": "ROLE_USER"
    },*/
    "city": $$('#city').val(),
    "country": $$('#country').val(),
    "emailId": $$('#email').val(),
    "firstName": $$('#firstName').val(),
    "lastName": $$('#surname').val(),
    "password": hash,
    "phoneNo": $$('#phone').val().replace(' ', ''),
    "postCode": $$('#postCode').val(),
    "role": "ROLE_USER",
    "state": $$('#state').val()
  };
  app.request({
    url: 'http://35.200.224.144:8090/api/v1/user',
    method: 'POST',
    contentType: 'application/json',//'multipart/form-data',
    dataType: 'json',
    data: JSON.stringify(dataPost),
    success: function (data, status, xhr) {
    //alert(JSON.stringify(data));
      $$('#userForm').hide();
      $$('#feedback').show();
  }});
}
function loginStart()
{
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
}
