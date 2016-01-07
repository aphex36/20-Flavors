(function(window, document, undefined) {

  /* Sets a random integer quantity in range [1, 20] for each flavor. */
  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
  function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue;
  }
  function getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i=0; i<ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1);
          if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
      }
      return "";
  }
  
  function setQuantities() {

    //Get all of the flavors and set each meta to have a quantity of a random number between 1 and 20
    var allFlavorQuantities = $(".flavor").find(".meta");
    allFlavorQuantities.map(function(flavorIndex)
    {
      $(allFlavorQuantities[flavorIndex]).prepend("<span class='quantity'>" + Math.floor((Math.random() * 10) + 1) + "</span>");
    });
  }

  /* Extracts and returns an array of flavor objects based on data in the DOM. Each
   * flavor object should contain five properties:
   *
   * element: the HTMLElement that corresponds to the .flavor div in the DOM
   * name: the name of the flavor
   * description: the description of the flavor
   * price: how much the flavor costs
   * quantity: how many cups of the flavor are available
   */
  function extractFlavors() {
    var flavorInformation = [];
    var allFlavors = $(".flavor");
    for(var i = 0; i < allFlavors.length; i++)
    {
      var obj = {};
      obj.element = allFlavors[i];
      obj.name = $(allFlavors[i]).find(".description").find("h2").html();
      obj.description = $(allFlavors[i]).find(".description").find("p").html();
      obj.price = parseFloat($(allFlavors[i]).find(".meta").find(".price").html().substring(1));
      obj.quantity = parseInt($(allFlavors[i]).find(".meta").find(".quantity").html());
      flavorInformation.push(obj);
    }
    return flavorInformation;
  }

  /* Calculates and returns the average price of the given set of flavors. The
   * average should be rounded to two decimal places. */
  function calculateAveragePrice(flavors) {
    var total = 0;
    flavors.forEach(function(element, index, array)
    {
      total += element.price;
    });
    var average = total/flavors.length;
    return average.toFixed(2);
  }

  /* Finds flavors that have prices below the given threshold. Returns an array
   * of strings, each of the form "[flavor] costs $[price]". There should be
   * one string for each cheap flavor. */
  function findCheapFlavors(flavors, threshold) {
    cheaperFlavors = flavors.filter(function(element,index,array)
    {
      if(element.price <= threshold)
      {
        return true;
      }
      else
      {
        return false;
      }
    });

    var cheapFlavorsPrices = [];
    cheaperFlavors.map(function(flavor)
    {
      cheapFlavorsPrices.push(flavor.name + " costs $" + flavor.price);
    });
    return cheapFlavorsPrices;
  }

  /* Populates the select dropdown with options. There should be one option tag
   * for each of the given flavors. */
  function populateOptions(flavors) {
    $("select").html("")
    flavors.map(function(flavor)
    {
      $("select").append("<option value='" + flavor.name + "'>" + flavor.name + "</option>");
    });
  }

  function findFlavorObjectIndex(flavors, name)
  {
    for(var i = 0; i < flavors.length; i++)
    {
      if(name === flavors[i].name)
      {
        return i;
      }
    }
  }
  /* Processes orders for the given set of flavors. When a valid order is made,
   * decrements the quantity of the associated flavor. */
  function isValidQuantity(n) {
     if(isNaN(n))
     {
       return false;
     }
     n = parseFloat(n);
     return n % 1 === 0 && n > 0;
  }
  function processOrders(flavors) {
    $("#submitOrder").click(function(event)
    {
      event.preventDefault();
      flavorObj = flavors[findFlavorObjectIndex(flavors, $("select").val())];
      if($("#amount").val() === "0")
      {
        $("#errorMessage").html("There is no " + $("select").val() + " left!");
        $("#errorMessage").css('visibility','visible');
      }
      else if(!isValidQuantity($("#amount").val())){
        $("#errorMessage").html("Please enter a valid quantity");
        $("#errorMessage").css('visibility','visible');
      }
      else if(parseInt($("#amount").val()) > flavorObj.quantity)
      {
        $("#errorMessage").html("There is not enough of the " + $("select").val() + " flavor to buy the quantity specified.");
        $("#errorMessage").css('visibility','visible');
      }
      else {
        $("#errorMessage").css('visibility','hidden');
        var amountLeft = flavors[findFlavorObjectIndex(flavors, $("select").val())].quantity - parseInt($("#amount").val());
        flavors[findFlavorObjectIndex(flavors, $("select").val())].quantity = amountLeft;
        console.log(amountLeft);
        var allFlavorHtmlObjects = $(".description").find("h2");
        for(var i = 0; i < allFlavorHtmlObjects.length; i++)
        {
          if($(allFlavorHtmlObjects[i]).html() === $("select").val())
          {
            $(allFlavorHtmlObjects[i]).parent().prev().find(".quantity").html(amountLeft);
            $("#amount").val("");
            break;
          }
        }
      }
    });
  }

  /* Highlights flavors when clicked to make a simple favoriting system. */
  function highlightFlavors(flavors) {
    $(".flavor").click(function(event)
    {
      $(".flavor").removeClass("highlighted");
      var target;
      if($(event.target).hasClass("flavor"))
      {
        target = event.target
      }
      else if($(event.target).parent().hasClass("flavor"))
      {
        target = $(event.target).parent()[0];
      }
      else if($(event.target).parent().parent().hasClass("flavor"))
      {
        target = $(event.target).parent().parent()[0];
      }
      if($(target).hasClass("highlighted"))
      {
        $(target).removeClass("highlighted");
      }
      else {
        $(target).addClass("highlighted");
      }
      $('select').val($(target).find(".description").find("h2").html());
    })
  }


  /***************************************************************************/
  /*                                                                         */
  /* Please do not modify code below this line, but feel free to examine it. */
  /*                                                                         */
  /***************************************************************************/


  var CHEAP_PRICE_THRESHOLD = 1.50;

  // setting quantities can modify the size of flavor divs, so apply the grid
  // layout *after* quantities have been set.
  setQuantities();
  var container = document.getElementById('container');
  new Masonry(container, { itemSelector: '.flavor' });

  // calculate statistics about flavors
  var flavors = extractFlavors();
  console.log(flavors);
  var averagePrice = calculateAveragePrice(flavors);
  console.log('Average price:', averagePrice);

  var cheapFlavors = findCheapFlavors(flavors, CHEAP_PRICE_THRESHOLD);
  console.log('Cheap flavors:', cheapFlavors);

  // handle flavor orders and highlighting
  populateOptions(flavors);
  processOrders(flavors);
  highlightFlavors(flavors);

})(window, document);
