import API_KEY from "./key.js";
const link = `http://www.omdbapi.com/?apikey=${API_KEY}&s=`;

const researchButton = document.getElementById("searchButton");
const researchInput = document.getElementById("searchInput");

const getFilms = async (element, researchFormat) => {
  try {
    const response = await fetch(`${link}${researchFormat}`);
    const films = await response.json();
    const listFilms = films.Search;
    console.log(listFilms);
    listFilms.forEach((film) => {
      showFilm(element, film.Poster, film.Title, film.Year, film.imdbID);
    });
  } catch (error) {
    console.error("Response error:", error.message);
  }
};

const showFilmDetails = async (filmID) => {
  const overlay = document.querySelector(".overlay");
  const popup = document.querySelector(".popup");

  function hidePopup() {
    overlay.style.display = "none";
    popup.style.display = "none";
    document.body.style.overflow = "auto";
  }

  function showPopup() {
    overlay.style.display = "block";
    popup.style.display = "block";
    document.body.style.overflow = "hidden";
    const close = document.querySelector(".close");
    console.log(close);
    close.addEventListener("click", hidePopup);
  }

  popup.innerHTML = `
  <span class="close">&times;</span>
  `;

  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=${API_KEY}&i=${filmID}`
    );
    const filmDetails = await response.json();

    // Show pop-up with movie details
    popup.innerHTML += `
      <div class="card mb-3" style="max-width: 720px;">
        <div class="row g-0">
          <div class="col-md-4">
            <img src=${filmDetails.Poster} class="img-fluid rounded-start">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${filmDetails.Title}</h5>
              <p class="card-text">${filmDetails.Released}</p>
              <p class="card-text">${filmDetails.Plot}
            </div>
          </div>
        </div>
      </div>
    `;
    showPopup();
  } catch (error) {
    console.error(
      "Error retrieving movie details:",
      error.message
    );
  }
  overlay.addEventListener("click", hidePopup);
};

const showFilm = (element, poster, title, year, ID) => {
  element.innerHTML += `
  <div class="card mb-3" style="max-width: 540px;">
    <div class="row g-0">
      <div class="col-md-4">
        <img src=${poster} class="img-fluid rounded-start">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${year}</p>
          <button class="btn btn-primary show-details" data-film-id="${ID}">Show details</button>
        </div>
      </div>
    </div>
  </div>
  `;

  const filmElements = document.querySelectorAll(".card");

  filmElements.forEach((element) => {
    observer.observe(element);
  });
};

document.querySelector(".results").addEventListener("click", function (event) {
  if (event.target.classList.contains("show-details")) {
    const filmID = event.target.dataset.filmId;
    showFilmDetails(filmID);
  }
});

researchButton.addEventListener("click", function (event) {
  event.preventDefault();
  const research = researchInput.value;

  const researchFormat = research.replace(/\s+/g, "+");

  console.log(researchFormat);

  const element = document.querySelector(".results");

  getFilms(element, researchFormat);
});

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
      }
    });
  },
  {
    threshold: 0.0,
  }
);

document.getElementById('title').addEventListener('click', function() {
  location.reload();
});