$(() => {
  setTimeout(() => {
    $("#enquiryFormButton").click();
  }, 3000);
  // portfolio filter section
  $(".filter .btn").on("click", function () {
    const value = $(this).attr("data-filter");
    console.log(value);
    if (value == "all") {
      $(".portfolio-images>div").show("1000");
    } else {
      $(".portfolio-images>div")
        .not("." + value)
        .hide("1000");
      $(".portfolio-images>div")
        .filter("." + value)
        .show("1000");
    }
    $(this).addClass("active").siblings().removeClass("active");
  });
  // searchbar functionality
  $("#searchbar").on("keyup", function () {
    let value = $(this).val().toLowerCase();
    console.log(value);
    $(".portfolio-images>div").filter(function () {
      $(this).toggle(
        $(this).text().trim().replace(/#/gi, "").toLowerCase().indexOf(value) >
          -1
      );
    });
  });
});
