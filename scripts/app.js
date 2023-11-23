(() => {
  "use strict";

  angular
    .module("NarrowItDownApp", [])
    .controller("NarrowItDownController", NarrowItDownController)
    .service("MenuSearchService", MenuSearchService);

  NarrowItDownController.$inject = ["MenuSearchService"];
  function NarrowItDownController(MenuSearchService) {
    let menu = this;
    menu.narrowTerm = "chicken";

    let promise = MenuSearchService.narrowItDown();

    promise
      .then(function (response) {
        menu.categories = response.data;
        console.log(menu.categories);
      })
      .catch(function (error) {
        console.log("error");
        console.log(error);
      });

    menu.logMenuItems = (shortName) => {
      let promise = MenuSearchService.getMenuForCategory(shortName);

      promise
        .then(function (response) {
          console.log("*********" + response.data.toString());
        })
        .catch(function (error) {
          console.log("error");
          console.log(error);
        });
    };
  }

  MenuSearchService.$inject = ["$http"];
  function MenuSearchService($http) {
    let search = this;

    search.narrowItDown = () => {
      console.log("narrowItDown called: ");

      let response = $http({
        method: "GET",
        url: "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json",
      });

      return response;
    };

    search.getMenuForCategory = (shortName) => {
      console.log("getMenuForCategory called: " + shortName);
      let response = $http({
        method: "GET",
        url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json",
        params: {
          category: shortName,
        },
      });
      return response;
    };
  }
})();
