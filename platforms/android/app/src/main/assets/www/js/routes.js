routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/form/',
    url: './pages/form.html',
  },
  {
    path: '/history/',
    url: './pages/history.html',
  },
  {
    path: '/dashboard/',
    url: './pages/dashboard.html',
  },
  {
    path: '/new-user/',
    url: './pages/new-user.html',
  },
  {
    path: '/my-account/',
    url: './pages/my-account.html',
  },
  {
    path: '/my-products/',
    url: './pages/my-products.html',
  },
  {
    path: '/browse/',
    url: './pages/browse.html',
  },
  {
    path: '/checkout/',
    url: './pages/checkout.html',
  },
  {
    path: '/products/:id/',
    //url: './pages/products.html',
    template: `<div class="page" data-name="products">
      <div class="navbar">
        <div class="navbar-inner sliding">
          <div class="left">
            <a href="#" class="link back">
              <i class="icon icon-back"></i>
              <span class="ios-only">Back</span>
            </a>
          </div>
          <div class="title">Products</div>
        </div>
      </div>
      <div class="page-content">
        <input type="hidden" value="{{$route.params.id}}" id="categoryId" />
        <div class="block-title">Select a Product</div>
        <div class="block"> <!--block-strong-->
          <div id="productContent" class="row">
          </div>
        </div>
      </div>
    </div>`
  },
  {
    path: '/product/:id/',
    template: `<div class="page" data-name="product">
      <div class="navbar">
        <div class="navbar-inner sliding">
          <div class="left">
            <a href="#" class="link back">
              <i class="icon icon-back"></i>
              <span class="ios-only">Back</span>
            </a>
          </div>
          <div class="title">Product Details</div>
        </div>
      </div>
      <div class="page-content">
        <input type="hidden" value="{{$route.params.id}}" id="productId" />
        <input type="hidden" id="productData" />
        <div class="block-title">Product Details</div>
        <div class="block"> <!--block-strong-->
          <div id="productContent" class="row">
            <div class="col-50">
              <img id="productImage" />
              <a href="#" id="cartButton" class="col button button-big button-fill button-raised color-green">Add to Cart</a>
              <a href="/checkout/" class="col button button-big button-fill button-raised color-red">Go to Checkout</a>
            </div>
            <div class="col-50" id="productDetails"></div>
          </div>
        </div>
      </div>
    </div>`
  },
  // Page Loaders & Router
  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html',
  },
  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/request-and-load.html',
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
