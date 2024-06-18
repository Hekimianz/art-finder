const artName = document.querySelector(".artName");
const artWork = document.querySelector(".artWork");
const artArtist = document.querySelector(".artArtist");
const artYear = document.querySelector(".artYear");
const descriptionBtn = document.querySelector(".descriptionBtn");
const artDescription = document.querySelector(".artDescription");
const artMedium = document.querySelector(".artMedium");
const spinner = document.querySelector(".spinner");
const descArrow = document.querySelector(".arrow-down");
const artData = {};

function renderArtData() {
  artName.innerText = artData.title;
  artWork.src = artData.artWork;
  artWork.onerror = () => getArt();
  artWork.classList.remove("hidden");
  artArtist.innerText = artData.artist;
  artYear.innerText =
    artData.year >= 0 ? artData.year : `${Math.abs(artData.year)} B.C.`;
  artDescription.innerHTML = artData.description ? artData.description : "";
  spinner.classList.add("hidden");
  artMedium.classList.remove("hidden");
  artMedium.innerText = `(${artData.medium})`;

  renderDescription("description");
}

function renderDescription(prop) {
  if (artData[prop]) {
    artDescription.innerHTML = artData.description;
    descriptionBtn.classList.remove("hidden");
  } else {
    descriptionBtn.classList.add("hidden");
    artDescription.classList.add("hidden");
  }
}

function getArt() {
  artName.innerText = "";
  artYear.innerText = "";
  artArtist.innerText = "";
  artWork.classList.add("hidden");
  artMedium.classList.add("hidden");
  spinner.classList.remove("hidden");
  const pages = 125841;
  const limit = 1;
  const apiUrl = `https://api.artic.edu/api/v1/artworks?page=${Math.floor(
    Math.random() * (pages - limit + 1) + limit
  )}&limit=${limit}`;

  fetch(`${apiUrl}`)
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
        console.log(data);
        const url = `${data.config["iiif_url"]}/${data.data[0]["image_id"]}/full/843,/0/default.jpg`;
        artData.title = data.data[0].title;
        artData.year = data.data[0]["date_end"];
        artData.artist = data.data[0]["artist_display"];
        artData.description = data.data[0]?.description;
        artData.artWork = url;
        artData.medium = data.data[0]?.medium_display;
        artData.credit = data.data[0]?.credit_line;
        console.log(artData.credit);

        renderArtData();
      }
    });
}

descriptionBtn.addEventListener("click", () => {
  artDescription.classList.toggle("hidden");
  descArrow.innerText === "arrow_drop_down"
    ? (descArrow.innerText = "arrow_drop_up")
    : (descArrow.innerText = "arrow_drop_down");
});

getArt();
