function loadContent(id) {
  // create list of the buttons that are inside the nav-bar
  const buttons = document.querySelectorAll(".nav-bar button");

  // remove the active class from all the buttons inside the nav-bar
  buttons.forEach(btn => btn.classList.remove("active"));

  // add active to the button that was clicked by the user
  document.getElementById(id).classList.add("active");

  // fetch the content and load it in place
  fetch("./content/" + id + ".html", {cache: "no-store"}).then(result => {
    if (result.ok) {return result.text();}
  }).then(content => {
    document.getElementById("content-area").innerHTML = content;
  })
};