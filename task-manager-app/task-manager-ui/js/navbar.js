document.addEventListener("DOMContentLoaded", () => {
  fetch("./shared/nav.html")
    .then(response => {
      if (!response.ok) {
        throw new Error("Navbar file not found");
      }
      return response.text();
    })
    .then(data => {
      document.getElementById("navbar").innerHTML = data;
    })
    .catch(error => console.error("Error loading navbar:", error));
});