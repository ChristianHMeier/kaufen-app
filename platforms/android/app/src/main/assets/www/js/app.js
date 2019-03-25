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
//var hashed;
var cart = [];
var searchText = '';

/*
 * The following blocks are code that executes when different screens are loaded
 */

//login screen
$$(document).on('page:init', '.page[data-name="home"]', function (e)
{
  loginStart();
});
//Dashboard screen
$$(document).on('page:init', '.page[data-name="dashboard"]', function (e)
{
  $$('#name').html(user.firstName);
});
//Product upload screen
$$(document).on('page:init', '.page[data-name="form"]', function (e)
{
    app.request({
      url: 'http://35.200.224.144:8090/api/v1/categories',
      method: 'GET',
      dataType: 'json',
      success: function (data, status, xhr) {
      for (var i = 0; i < data.data.length; i++)
      {
        $$('#category').append($$('<option>').attr({'value': data.data[i].categoryId, 'text': data.data[i].categoryName}));
      }
    },
    error:	function (xhr, status)
    {
      let response = JSON.stringify(xhr.response);
      alert(response.message);
      app.preloader.hide();
    }});
    $$('#feedback').hide();
    //Bind event to product upload
    $$('#upload').on('click', function()
    {
        var dataPost = {
          "categoryId": $$('#category').val(),
          "depth": $$('#depth').val(),
          "description": $$('#description').val(),
          "height": $$('#height').val(),
          "itemStatus": 1,
          "length": $$('#length').val(),
          "price": $$('#price').val(),
          "prodCondition": $$('#prodCondition').val(),
          "productName": $$('#productName').val(),
          "publicationDate": new Date().toISOString().slice(0, 28),
          "sellerId":user.id,
          "slug": $$('#productName').val().toLowerCase().replace(' ', '-'),
          "stock": $$('#stock').val(),
          "type": $$('#type').val(),
          "weight": $$('#weight').val()
        };
        var formData = new FormData();
        formData.append("product", JSON.stringify(dataPost));
        formData.append("file",  document.getElementById("imageFile").files[0]);
        app.request({
          url: 'http://35.200.224.144:8090/api/v1/product',
          headers: {Authorization: "Bearer "+securityToken},
          method: 'POST',
          contentType: 'multipart/form-data',
          dataType: 'json',
          data: formData,
          success: function (data, status, xhr) {
            $$('#productForm').hide();
            $$('#feedback').show();
        },
        error:	function (xhr, status)
        {
          let response = JSON.stringify(xhr.response);
          alert(response.message);
          app.preloader.hide();
        }});
      });
});
//Browse store screen
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
        $$('#categoryBlock').append($$('<div>').addClass('row')
          .append($$('<div>').addClass('col-100')
            .append($$('<a>').addClass('button button-raised button-fill')
                                  .attr({
                                    'href': '/products/'+data.data[i].categoryId+'/',
                                    'text': data.data[i].categoryName+' ('+data.data[i].categoryCount+')'
                                  })
                )
              )
            );
      }
      app.preloader.hide();
    },
    error:	function (xhr, status)
    {
      let response = JSON.stringify(xhr.response);
      alert(response.message);
      app.preloader.hide();
    }});
    if (searchText !== '')
    {
      searchProducts();
    }
    $$('#searchText').on('keyUp', function() {searchText = $$('#searchText').val();});
    $$('#searchButton').on('click', function()
    {
      $$('#searchText').val($$('#searchText').val().trim());
      if ($$('#searchText').val() !== '')
      {
        searchProducts();
      }
    });
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
    for (var i = 0; i < data.data.length; i++)
    {
      $$('#productContent').append($$('<div>').addClass('col-50 product-list-item')
            .append($$('<a>').attr({'href': '/product/'+data.data[i].id+'/'})
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
  },
  error:	function (xhr, status)
  {
    let response = JSON.stringify(xhr.response);
    alert(response.message);
    app.preloader.hide();
  }});
});
//Order history
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
    if (data.data.length === 0)
    {
      $$('#productContent').append($$('<div>').addClass('col-50').html('You have not purchased anything yet.'));
    }
    else
    {
      for (var i = 0; i < data.data.length; i++)
      {
        $$('#productContent')
          .append($$('<div>').addClass('col-20 product-list-item').html(data.data[i].purchaseId))
          .append($$('<div>').addClass('col-30 product-list-item')
              .append($$('<a>').attr({
                                    'href': '/product/'+data.data[i].productId+'/',
                                    'text': data.data[i].productName
                                  })
                )
          )
          .append($$('<div>')
            .addClass('col-20 product-list-item')
            .html(data.data[i].price.toFixed(2).replace('.', ',')+' €'))
          .append($$('<div>')
            .addClass('col-30 product-list-item')
            .html(data.data[i].purchaseDate.replace('T', ' ').slice(0, 19)));
      }
    }
    app.preloader.hide();
  },
  error:	function (xhr, status)
  {
    let response = JSON.stringify(xhr.response);
    alert(response.message);
    app.preloader.hide();
  }});
});
//Products uploaded by the user
$$(document).on('page:init', '.page[data-name="my-products"]', function (e)
{
  $$('#preloaderText').html('Loading Your Products...');
  app.preloader.show();
  app.request({
    url: 'http://35.200.224.144:8090/api/v1/product/',//seller/'+user.id,
    method: 'GET',
    headers: {Authorization: "Bearer "+securityToken},
    dataType: 'json',
    success: function (data, status, xhr) {
    var myProducts = [];
    for (var i = 0; i < data.data.length; i++)
    {
      if (data.data[i].sellerId === user.id)
      {
        myProducts.push(data.data[i]);
      }
    }
    if (myProducts.length === 0)
    {
      $$('#productContent').append($$('<div>')
        .addClass('col-50')
        .html('You have not published anything yet.'));
    }
    else
    {
        for (var i = 0; i < myProducts.length; i++)
      {
        $$('#productContent').append($$('<div>')
          .addClass('col-50 product-list-item')
          .append($$('<a>')
            .attr({
                    'href': '/product/'+myProducts[i].id+'/',
                    'text': myProducts[i].productName+' ('+myProducts[i].stock+')'
                  })
            .append($$('<img>').attr({
                                      'src': myProducts[i].imgPath,
                                      'alt': myProducts[i].productName,
                                      'title': myProducts[i].productName
                                    }))
            .append($$('<p>')
              .attr({'text': myProducts[i].productName+' ('+myProducts[i].stock+')'}))
                )
              );
      }
    }
    app.preloader.hide();
  },
  error:	function (xhr, status)
  {
    let response = JSON.stringify(xhr.response);
    alert(response.message);
    app.preloader.hide();
  }});
});
//Product screen
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
    if (data.data.stock > 0 && data.data.sellerId !== user.id)
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
      var disabledText = ''
      if (data.data.stock === 0)
      {
        disabledText += 'Out of Stock';
      }
      else
      {
        disabledText += 'You posted this product';
      }
      $$('#cartButton').attr('disabled', 'disabled').html(disabledText);
    }
    app.preloader.hide();
  },
  error:	function (xhr, status)
  {
    let response = JSON.stringify(xhr.response);
    alert(response.message);
    app.preloader.hide();
  }});

});
//New user screen
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
//Edit user account screen
$$(document).on('page:init', '.page[data-name="my-account"]', function (e)
{
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
  $$('#register').on('click', function()
  {
      var salt = gensalt(12);
      hashpw($$('#pass').val(), salt, updating);
  });
});
//Cart checkout screen
$$(document).on('page:init', '.page[data-name="checkout"]', function (e)
{
  for (var i = 0; i < cart.length; i++)
  {
    $$('#cartTable').append($$('<div>').addClass('row').addClass('cartRow')
      .append($$('<div>').addClass('col-5')
        .append($$('<img>').attr({
                                  'alt': cart[i].productName,
                                  'title': cart[i].productName,
                                  'src': cart[i].imgPath
                                }))
      )
      .append($$('<div>').addClass('col-60')
        .append($$('<span>').html(cart[i].productName))
      )
      .append($$('<div>')
        .addClass('col-20')
        .html(cart[i].price.toString().replace('.', ',')+' €'))
      .append($$('<div>').addClass('col-15')
        .append($$('<input>')
          .attr({
                  'type': 'button',
                  'value': 'X',
                  'data-id': cart[i].id,
                  'data-index': i
                })
          .on('click', function()
          {
            cart.splice(parseInt($$(this).attr('data-index')), 1);
            $$(this).parent().parent().remove();
            checkTable();
          })
        )
      )
    );
  }
  $$('#orderButton').on('click', function()
  {
    $$('#preloaderText').html('Submitting order...');
    app.request({
      url: 'http://35.200.224.144:8090/api/v1/product/buy',
      method: 'POST',
      headers: {
                Authorization: "Bearer "+securityToken
              },
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(cart),
      success: function (data, status, xhr) {
        cart = [];
        $$('.cartRow').remove();
        checkTable();
        $$('#cartTable, #totalRow').hide();
        $$('#feedback').html(data.message).show();
        app.preloader.hide();
    },
    error:	function (xhr, status)
    {
      let response = JSON.stringify(xhr.response);
      alert(response.message);
      app.preloader.hide();
    }});
  });
  checkTable();
});

//Auxiliary function for the product search
function searchProducts()
{
    $$('#preloaderText').html('Searching Products...');
    $$('#productRow').empty();
    app.preloader.show();
    app.request({
      url: 'http://35.200.224.144:8090/api/v1/product/search',
      method: 'GET',
      dataType: 'json',
      data: {query: encodeURI($$('#searchText').val())},
      success: function (data, status, xhr) {
      for (var i = 0; i < data.data.length; i++)
      {
        $$('#productRow').append($$('<div>').addClass('col-50 product-list-item')
              .append($$('<a>').attr({
                                    'href': '/product/'+data.data[i].id+'/'
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
    },
    error:	function (xhr, status)
    {
      let response = JSON.stringify(xhr.response);
      alert(response.message);
      app.preloader.hide();
    }});
}
//Auxuliary function for the Checkout screen
function checkTable()
{
  var total = 0;
  if (cart.length === 0)
  {
    $$('#orderButton')
      .attr({'href': '/dashboard/'})
      .off('click')
      .html('Your cart is empty, come back later');
  }
  else
  {
      for (var i = 0; i < cart.length; i++)
      {
        total += cart[i].price;
      }
  }
  $$('#cartTotal').html(total.toFixed(2).toString().replace('.', ','));
}
//Auxiliary function for the product screen
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
//Callback function when a new user is registered and the password must be hashed
function hashing(hash)
{
  var dataPost = {
    "address": $$('#address').val(),
    "alias": $$('#alias').val(),
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
  app.request({
    url: 'http://35.200.224.144:8090/api/v1/user',
    method: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(dataPost),
    success: function (data, status, xhr) {
      $$('#userForm').hide();
      $$('#feedback').show();
      app.preloader.hide();
  },
  error:	function (xhr, status)
  {
    let response = JSON.stringify(xhr.response);
    alert(response.message);
    app.preloader.hide();
  }});
}
//Callback function when a logged user updates their data
function updating(hash)
{
  var dataPut = {
    "address": $$('#address').val(),
    "alias": $$('#alias').val(),
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
    let response = JSON.stringify(xhr.response);
    alert(response.message);
    app.preloader.hide();
  }
});
}
//Auxiliary function for the login screen
function loginStart()
{
  $$('#my-login-screen .login-button').on('click', function () {
    var username = $$('#my-login-screen [name="username"]').val();
    var password = $$('#my-login-screen [name="password"]').val();

    app.preloader.show();
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
      app.preloader.hide();
      $$("#dashboardLink").click();
      },
      error:	function (xhr, status)
      {
        if (status === 401)
        {
          alert('Wrong email or password.')
        }
        else
        {
          let response = JSON.stringify(xhr.response);
          alert(response.message);
        }
        app.preloader.hide();
      }
    });
  });
}
