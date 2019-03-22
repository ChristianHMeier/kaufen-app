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

var user;//Id;
var securityToken;
var hashed;
var cart = [];

//loginStart();
$$(document).on('page:init', '.page[data-name="home"]', function (e)
{
  loginStart();
});
$$(document).on('page:init', '.page[data-name="dashboard"]', function (e)
{
  $$('#name').html(user.firstName);
  //alert(user.id);
  //alert(securityToken);
//  $$("#testLink").on('click', function()
  //{
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
  //});
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
      /*if (document.getElementById("imageFile").files.length > 0)
      {
        alert('No file selected');
      }*/
        var dataPost = {
          "categoryId": $$('#category').val(),
          //"categoryName": $$('#category').val(),
          "depth": $$('#depth').val(),
          "description": $$('#description').val(),
          "height": $$('#height').val(),
          "itemStatus": 1,
          "length": $$('#length').val(),
          "price": $$('#price').val(),
          "prodCondition": $$('#prodCondition').val(),
          "productName": $$('#productName').val(),
          "publicationDate": new Date().toISOString().slice(0, 28),//19).replace('T', ' '),
          "sellerId":user.id,
          "slug": $$('#productName').val().toLowerCase().replace(' ', '-'),
          "stock": $$('#stock').val(),
          "type": $$('#type').val(),
          "weight": $$('#weight').val()
        };
        var formData = new FormData();
        formData.append("product", JSON.stringify(dataPost));
        formData.append("file",  document.getElementById("imageFile").files[0]);//fileData);
        //alert(JSON.stringify(dataPost));
        app.request({
          url: 'http://35.200.224.144:8090/api/v1/product',
          headers: {Authorization: "Bearer "+securityToken},
          method: 'POST',
          contentType: 'multipart/form-data',
          dataType: 'json',
          data: formData,
          success: function (data, status, xhr) {
          //alert(JSON.stringify(data));
            $$('#productForm').hide();
            $$('#feedback').show();
        }});
      });
});
$$(document).on('page:init', '.page[data-name="browse"]', function (e)
{
    $$('#preloaderText').html('Loading Categories...');
    app.preloader.show();
    app.request({
      url: 'http://35.200.224.144:8090/api/v1/categories/count',
      method: 'GET',
      dataType: 'json',
      success: function (data, status, xhr) {
      //alert(JSON.stringify(data));
      for (var i = 0; i < data.data.length; i++)
      {
        $$('#categoryContent').append($$('<div>').addClass('block')
          .append($$('<div>').addClass('row')
            .append($$('<div>').addClass('col-100')
              .append($$('<a>').addClass('button button-raised button-fill').attr({
                                    'href': '/products/'+data.data[i].categoryId+'/',
                                    'text': data.data[i].categoryName+' ('+data.data[i].categoryCount+')'
                                  })
                    )
                  )
                )
              );
      }
      app.preloader.hide();
    }});
});
$$(document).on('page:init', '.page[data-name="products"]', function (e)
{
  var ajaxUrl = ''
  var dataBody = {};
  if ($$('#categoryId').val() === '0')
  {
    ajaxUrl +=  'http://35.200.224.144:8090/api/v1/product';
  }
  else
  {
    ajaxUrl +=  'http://35.200.224.144:8090/api/v1/product/filter';
    dataBody['category'] = $$('#categoryId').val();
    dataBody['sortBy'] = 'name';
    dataBody['order'] = 'ASC';

  }

  $$('#preloaderText').html('Loading Products...');
  app.preloader.show();
  app.request({
    url: ajaxUrl,
    method: 'GET',
    dataType: 'json',
    data: dataBody,
    success: function (data, status, xhr) {
    //alert(JSON.stringify(data));
    for (var i = 0; i < data.data.length; i++)
    {
      $$('#productContent').append($$('<div>').addClass('col-50 product-list-item')
            .append($$('<a>').attr({
                                  'href': '/product/'+data.data[i].id+'/'//,
                                  //'text': data.data[i].productName+' ('+data.data[i].stock+')'
                                })
                  .append($$('<img>').attr({
                                        'src': data.data[i].imgPath,
                                        'alt': data.data[i].productName,
                                        'title': data.data[i].productName
                                    }))
                  .append($$('<p>').html(data.data[i].productName+' ('+data.data[i].stock+')'))
              )
            );
    }
    app.preloader.hide();
  }});
});
$$(document).on('page:init', '.page[data-name="history"]', function (e)
{

  $$('#preloaderText').html('Loading Bought Products...');
  app.preloader.show();
  app.request({
    url: 'http://35.200.224.144:8090/api/v1/product/bought/'+user.id,
    method: 'GET',
    headers: {Authorization: "Bearer "+securityToken},
    dataType: 'json',
    success: function (data, status, xhr) {
    //alert(JSON.stringify(data));
    if (data.data.length === 0)
    {
      $$('#productContent').append($$('<div>').addClass('col-50').html('You have not purchased anything yet.'));
    }
    else
    {
      for (var i = 0; i < data.data.length; i++)
      {
        $$('#productContent').append($$('<div>').addClass('col-50 product-list-item')
              .append($$('<a>').attr({
                                    'href': '/product/'+data.data[i].id+'/',
                                    'text': data.data[i].productName+' ('+data.data[i].stock+')'
                                  })
                    .append($$('<img>').attr({
                                          'src': data.data[i].imgPath,
                                          'alt': data.data[i].productName,
                                          'title': data.data[i].productName
                                      }))
                    .append($$('<p>').attr({'text': data.data[i].productName+' ('+data.data[i].stock+')'}))
                )
              );
      }
      app.preloader.hide();
    }
  }});
});
  $$(document).on('page:init', '.page[data-name="my-products"]', function (e)
  {

    $$('#preloaderText').html('Loading Your Products...');
    app.preloader.show();
    app.request({
      url: 'http://35.200.224.144:8090/api/v1/product/seller/'+user.id,
      method: 'GET',
      headers: {Authorization: "Bearer "+securityToken},
      dataType: 'json',
      success: function (data, status, xhr) {
      //alert(JSON.stringify(data));
      if (data.data.length === 0)
      {
        $$('#productContent').append($$('<div>').addClass('col-50').html('You have not published anything yet.'));
      }
      else
      {
        for (var i = 0; i < data.data.length; i++)
        {
          $$('#productContent').append($$('<div>').addClass('col-50 product-list-item')
                .append($$('<a>').attr({
                                      'href': '/product/'+data.data[i].id+'/',
                                      'text': data.data[i].productName+' ('+data.data[i].stock+')'
                                    })
                      .append($$('<img>').attr({
                                            'src': data.data[i].imgPath,
                                            'alt': data.data[i].productName,
                                            'title': data.data[i].productName
                                        }))
                      .append($$('<p>').attr({'text': data.data[i].productName+' ('+data.data[i].stock+')'}))
                  )
                );
        }
        app.preloader.hide();
      }
    }});
});
$$(document).on('page:init', '.page[data-name="product"]', function (e)
{
  $$('#preloaderText').html('Loading Product Data...');
  app.preloader.show();
  app.request({
    url: 'http://35.200.224.144:8090/api/v1/product/'+$$('#productId').val(),
    method: 'GET',
    dataType: 'json',
    success: function (data, status, xhr) {
    $$('#productData').val(JSON.stringify(data.data));
    $$('#productImage').attr('src', data.data.imgPath);
    var details = 'Name: '+data.data.productName+'<br />';
    details += 'Price: '+data.data.price+'<br />';
    details += 'Category: '+data.data.categoryName+'<br />';
    details += 'Stock: '+data.data.stock+'<br />';
    $$('#productDetails').html(details);
    if (data.data.stock > 0)
    {
      if (productInCart(parseInt($$('#productId').val())))
      {
        $$('#cartButton').html('Remove from Cart');
      }
      $$('#cartButton').on('click', function()
      {
        let inCart = productInCart(parseInt($$('#productId').val()));
        if (!inCart)
        {
          var product = JSON.parse($$('#productData').val());
          //Add the buyer id so it can be used in the later POST request
          product.buyerId = user.id;
          cart.push(product);
          $$('#cartButton').html('Remove from Cart');
        }
        else
        {
          for (var i = 0; i < cart.length; i++)
          {
            if (cart[i].id === parseInt($$('#productId').val()))
            {
              cart.splice(i, 1);
              break;
            }
          }
          $$('#cartButton').html('Add to Cart');
        }
      });
    }
    else
    {
      $$('#cartButton').attr('disabled', 'disabled').html('Out of Stock');
    }
    app.preloader.hide();
  }});

});
$$(document).on('page:init', '.page[data-name="new-user"]', function (e)
{
  $$('#feedback').hide();
  $$('#register').on('click', function()
  {
      app.preloader.show();
      var salt = gensalt(12);
      hashpw($$('#pass').val(), salt, hashing);
  });
});
$$(document).on('page:init', '.page[data-name="my-account"]', function (e)
{
  /*$$('#feedback').hide();
    app.request({
      url: 'http://35.200.224.144:8090/api/v1/user/',
      method: 'GET',
      headers: {Authorization: "Bearer "+securityToken},
      data: {user.id: user.id},
      dataType: 'json',
      success: function (data, status, xhr) {*/
      //alert(JSON.stringify(data));
      $$('#firstName').val(user.firstName);
      $$('#surname').val(user.lastName);
      $$('#alias').val(user.alias);
      $$('#email').val(user.emailId);
      $$('#country').val(user.country);
      $$('#state').val(user.state);
      $$('#city').val(user.city);
      $$('#postCode').val(user.postCode);
      $$('#address').val(user.address);
      $$('#phone').val(user.phoneNo);
      $$('#feedback').hide();
  //});
  $$('#register').on('click', function()
  {
      var salt = gensalt(12);
      hashpw($$('#pass').val(), salt, updating);
  });
});

function productInCart(id)
{
    let inCart = false;
    for (var i = 0; i < cart.length; i++)
    {
      if (cart[i].id === id)
      {
        inCart = true;
        break;
      }
    }
    return inCart;
}

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
  $$('#preloaderText').html('Creating your user account...');
  //app.preloader.show();
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
      app.preloader.hide();
  }});
}
function updating(hash)
{
  //alert('Hash is '+hash);
  //hashed = hash;

  var dataPut = {
    "address": $$('#address').val(),
    "alias": $$('#alias').val(),
    /*"authorities": {
      "authority": "ROLE_USER"
    },*/
    "id": user.id,
    "city": $$('#city').val(),
    "country": $$('#country').val(),
    "emailId": $$('#email').val(),
    "firstName": $$('#firstName').val(),
    "lastName": $$('#surname').val(),
    "password": hash,
    "phoneNo": $$('#phone').val().replace(' ', ''),
    "postCode": $$('#postCode').val(),
    "role": "ROLE_USER",
    "state": $$('#state').val(),
    "token": securityToken
  };

  $$('#preloaderText').html('Updating your account...');
  app.preloader.show();

  app.request({
    url: 'http://35.200.224.144:8090/api/v1/user/'+user.id,
    method: 'PUT',
    headers: {
              Authorization: "Bearer "+securityToken
            },
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(dataPut),
    success: function (data, status, xhr)
    {
      $$('#userForm').hide();
      $$('#feedback').show();
      user = data.data;
      //security step
      user.password = '';
      app.preloader.hide();
  },
  error:	function (xhr, status)
  {
    console.log(xhr);
    console.log(status);
  }
});
}
function loginStart()
{
  // Login Screen Demo
  $$('#my-login-screen .login-button').on('click', function () {
    var username = $$('#my-login-screen [name="username"]').val();
    var password = $$('#my-login-screen [name="password"]').val();

    app.request({
      url: 'http://35.200.224.144:8090/api/v1/login',
      method: 'POST',
      dataType: 'json',
      data: {emailId: username, password: password},
      success: function (data, status, xhr) {
      user = data.user;
      securityToken = data.user.token;
      $$('#my-login-screen [name="username"]').val('');
      $$('#my-login-screen [name="password"]').val('');
      $$("#dashboardLink").click();
    },
    error: function (xhr, status)
    {
      console.log(xhr);
    }
  });
  //var mainView = app.addView('.view-main')

  // Load page from about.html file to main View:
  //mainView.router.loadPage('pages/dashboard.html');
  // Close login screen
  //app.loginScreen.close('#my-login-screen');

  // Alert username and password
  //app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
  });
}
