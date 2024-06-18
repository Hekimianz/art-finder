const artName = document.querySelector(".artName");
const artWork = document.querySelector(".artWork");
const artArtist = document.querySelector(".artArtist");
const artYear = document.querySelector(".artYear");
const artDescription = document.querySelector(".artDescription");
const artMedium = document.querySelector(".artMedium");
const spinner = document.querySelector(".spinner");
const fullScreenCont = document.querySelector(".fullScreen");
const closeFull = document.querySelector(".closeFull");
const fullScreenImg = fullScreenCont.querySelector("img");

const descriptionBtn = document.querySelector(".descriptionBtn");
const acquisitionBtn = document.querySelector(".acquisitionBtn");
const categoryBtn = document.querySelector(".categoryBtn");
const dimensionsBtn = document.querySelector(".dimensionsBtn");
const dimensionsText = document.querySelector(".artDimensions");
const acquisitionText = document.querySelector(".artAcquisition");
const categoryText = document.querySelector(".artCategory");
const descArrow = descriptionBtn.querySelector(".arrow-down");
const acqArrow = acquisitionBtn.querySelector(".arrow-down");
const dimArrow = dimensionsBtn.querySelector(".arrow-down");
const catArrow = categoryBtn.querySelector(".arrow-down");

const artData = {};
let rotation = 0;

function renderArtData() {
  artName.innerText = artData.title;
  artWork.src = artData.artWork;
  fullScreenImg.src = artData.artWork;
  artWork.onerror = () => getArt();
  artWork.classList.remove("hidden");
  artArtist.innerText = artData.artist;
  artYear.innerText =
    artData.year >= 0 ? artData.year : `${Math.abs(artData.year)} B.C.`;
  artMedium.innerText = artData.medium ? `(${artData.medium})` : "";
  artMedium.classList.remove("hidden");
  spinner.classList.add("hidden");

  renderProperty(
    artData.description,
    "Description",
    descriptionBtn,
    artDescription,
    descArrow
  );
  renderProperty(
    artData.credit,
    "Acquisition",
    acquisitionBtn,
    acquisitionText,
    acqArrow
  );
  renderProperty(
    artData.dimensions,
    "Dimensions",
    dimensionsBtn,
    dimensionsText,
    dimArrow
  );
  renderProperty(
    artData.category,
    "Category",
    categoryBtn,
    categoryText,
    catArrow
  );
}

function renderProperty(value, label, btnElement, textElement, arrowElement) {
  if (value) {
    textElement.innerHTML = value;
    btnElement.classList.remove("hidden");
    if (!btnElement.dataset.clickEventAttached) {
      btnElement.addEventListener("click", () => {
        textElement.classList.toggle("hidden");
        arrowElement.innerText === "arrow_drop_down"
          ? (arrowElement.innerText = "arrow_drop_up")
          : (arrowElement.innerText = "arrow_drop_down");
      });
      btnElement.dataset.clickEventAttached = true;
    }
  } else {
    btnElement.classList.add("hidden");
    textElement.classList.add("hidden");
    btnElement.dataset.clickEventAttached = false;
  }
}

function getArt() {
  artName.innerText = "";
  artYear.innerText = "";
  artArtist.innerText = "";
  artWork.classList.add("hidden");
  artMedium.classList.add("hidden");
  spinner.classList.remove("hidden");
  descriptionBtn.classList.add("hidden");
  artDescription.classList.add("hidden");
  categoryBtn.classList.add("hidden");
  categoryText.classList.add("hidden");
  acquisitionBtn.classList.add("hidden");
  acquisitionText.classList.add("hidden");
  dimensionsBtn.classList.add("hidden");
  dimensionsText.classList.add("hidden");

  descArrow.innerText = "arrow_drop_down";
  catArrow.innerText = "arrow_drop_down";
  acqArrow.innerText = "arrow_drop_down";
  dimArrow.innerText = "arrow_drop_down";

  const pages = 125841;
  const limit = 1;
  const apiUrl = `https://api.artic.edu/api/v1/artworks?page=${Math.floor(
    Math.random() * (pages - limit + 1) + limit
  )}&limit=${limit}`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      if (
        data.data[0]["artist_title"] === "Unknown Maker" ||
        !data.data[0]["artist_title"] ||
        !data.data[0]["image_id"] ||
        data.data[0]["artwork_type_title"] === "Archives (groupings)"
      ) {
        getArt();
      } else {
        const url = `${data.config["iiif_url"]}/${data.data[0]["image_id"]}/full/843,/0/default.jpg`;
        artData.title = data.data[0].title;
        artData.year = data.data[0]["date_end"];
        artData.artist = data.data[0]["artist_display"];
        artData.description = data.data[0]?.description;
        artData.artWork = url;
        artData.medium = data.data[0]?.medium_display;
        artData.credit = data.data[0]?.credit_line;
        artData.dimensions = data.data[0]?.dimensions;
        artData.category = data.data[0]?.category_titles[0];

        renderArtData();
      }
    })
    .catch((error) => {
      console.error("Error fetching artwork:", error);
    });
}

closeFull.addEventListener("click", () => {
  fullScreenCont.classList.add("hidden");
});

artWork.addEventListener("click", () => {
  fullScreenCont.classList.remove("hidden");
});

document.querySelector(".newArt").addEventListener("click", function () {
  this.style.transform = `rotate(${(rotation -= 360)}deg)`;
  getArt();
});

getArt();
