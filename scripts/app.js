(function () {
  "use strict";

  angular
    .module("NarrowItDownApp", [])
    .controller("NarrowItDownController", NarrowItDownController)
    .service("MenuSearchService", MenuSearchService)
    .constant("ApiBasePath", "https://coursera-jhu-default-rtdb.firebaseio.com")
    .directive("foundItems", FoundItems);

  function FoundItems() {
    let ddo = {
      restrict: "E",
      templateUrl: "foundItems.html",
      scope: {
        foundItems: "<",
        onEmpty: "<",
        onRemove: "&",
      },
      controller: NarrowItDownController,
      controllerAs: "menu",
      bindToController: true,
    };

    return ddo;
  }

  NarrowItDownController.$inject = ["MenuSearchService"];

  function NarrowItDownController(MenuSearchService) {
    let menu = this;
    menu.shortName = "";

    menu.matchedMenuItems = (searchTerm) => {
      let promise = MenuSearchService.getMatchedMenuItems(searchTerm);

      promise.then((items) => {
        if (items && items.length > 0) {
          menu.message = "";
          menu.found = items;
        } else {
          menu.message = "Nothing found!";
          menu.found = [];
        }
      });
    };

    menu.removeMenuItem = (itemIndex) => {
      menu.found.splice(itemIndex, 1);
    };
  }

  MenuSearchService.$inject = ["$http", "ApiBasePath"];

  function MenuSearchService($http, ApiBasePath) {
    let service = this;

    service.getMatchedMenuItems = (searchTerm) => {
      let response = $http({
        method: "GET",
        url: ApiBasePath + "/menu_items.json",
      });

      return response.then((result) => {
        let searchItems = [];
        let data = result.data;

        for (let category in data) {
          searchItems.push(
            data[category].menu_items.filter((item) =>
              item.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
        }
        return searchItems.flat();
      });
    };
  }
})();
