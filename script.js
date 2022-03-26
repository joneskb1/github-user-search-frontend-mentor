const logo = document.querySelector(".logo");
const lightModeContainer = document.querySelector(".light-mode-container");
const lightModeText = document.querySelector(".light-mode-text");
const lightModeImg = document.querySelector(".light-mode-image");
const userImg = document.querySelector(".user-img");
const fullName = document.querySelector(".full-name");
const userName = document.querySelector(".username");
const dateJoined = document.querySelector(".joined");
const bio = document.querySelector(".bio");
const repos = document.querySelector(".repos");
const followers = document.querySelector(".followers");
const following = document.querySelector(".following");
const city = document.querySelector(".location");
const blog = document.querySelector(".blog");
const company = document.querySelector(".company");
const twitter_username = document.querySelector(".twitter_username");
const detailIcons = [...document.querySelectorAll(".detail-icon")];
const body = document.querySelector("body");
const cardContainer = document.querySelector(".user-card-container");
const searchContainer = document.querySelector(".search-container");
const searchBtn = document.querySelector(".search-btn");
const statContainer = document.querySelector(".stat-container");
const searchInput = document.querySelector(".username-input");
const error = document.querySelector(".error");
const statText = [...document.querySelectorAll(".stat-text")];
const statNum = [...document.querySelectorAll(".stat-num")];
let nullItemsArr = [];

class FetchWrapper {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  get(endpoint) {
    return fetch(this.baseURL + endpoint).then((response) => response.json());
  }
}

function getNA(data) {
  for (const key in data) {
    if (key === "location" && data[key] === null) {
      nullItemsArr.push(key);
    } else if (key === "blog" && data[key] === "") {
      nullItemsArr.push(key);
    } else if (key === "twitter_username" && data[key] === null) {
      nullItemsArr.push(key);
    } else if (key === "company" && data[key] === null) {
      nullItemsArr.push(key);
    } else if (key === "bio" && data[key] === null) {
      nullItemsArr.push("bio");
    }
  }

  return nullItemsArr;
}

function formatDetails() {
  // bio
  if (
    nullItemsArr.includes("bio") &&
    lightModeImg.classList.contains("dark-sun")
  ) {
    bio.classList.add("not-available-dark");
    bio.classList.remove("not-available-light");
  } else if (
    nullItemsArr.includes("bio") &&
    !lightModeImg.classList.contains("dark-sun")
  ) {
    bio.classList.add("not-available-light");
    bio.classList.remove("not-available-dark");
  } else {
    bio.classList.remove("not-available-light");
    bio.classList.remove("not-available-dark");
  }

  // set details
  detailIcons.forEach((icon) => {
    let el = document.querySelector(`.${icon.dataset.detailCategory}`);
    // check if null, set text & color
    if (nullItemsArr.includes(icon.dataset.detailCategory)) {
      el.textContent = "Not available";
      if (lightModeImg.classList.contains("dark-sun")) {
        el.classList.add("not-available-dark");
        el.classList.remove("not-available-light");
        icon.src = `assets/icon-${icon.dataset.detailCategory}-dark-NA.svg`;
      } else {
        el.classList.add("not-available-light");
        el.classList.remove("not-available-dark");
        icon.src = `assets/icon-${icon.dataset.detailCategory}-light-NA.svg`;
      }
    } else {
      // data is available
      el.classList.remove("not-available-light");
      el.classList.remove("not-available-dark");
      // set icon & text color
      if (lightModeImg.classList.contains("dark-sun")) {
        icon.src = `assets/icon-${icon.dataset.detailCategory}-dark.svg`;
        el.classList.add("dark-white-text");
      } else {
        icon.src = `assets/icon-${icon.dataset.detailCategory}.svg`;
        el.classList.remove("dark-white-text");
      }
    }
  });
}

function searchUser(e) {
  e.preventDefault();
  // reset nullItems
  nullItemsArr = [];

  const API = new FetchWrapper(`https://api.github.com/users/`);
  // show octocat on load & if search empty
  const user = searchInput.value === "" ? "octocat" : searchInput.value;
  // get user from the API
  API.get(user).then((data) => {
    // error text if user not found
    if (data.message === "Not Found") {
      error.style.display = "block";
      return;
    } else {
      error.style.display = "none";
    }

    // img
    userImg.src = data.avatar_url;

    // show username for name if null
    if (data.name === null) {
      const name = data.login;
      fullName.textContent = name;
    } else {
      fullName.textContent = data.name;
    }
    // username
    userName.textContent = `@${data.login}`;

    // format joined date
    const year = data.created_at.slice(0, 4);
    let month = Number(data.created_at.slice(5, 7));
    const day = data.created_at.slice(8, 10);
    switch (month) {
      case 01:
        month = "Jan";
        break;
      case 02:
        month = "Feb";
        break;
      case 03:
        month = "Mar";
        break;
      case 04:
        month = "Apr";
        break;
      case 05:
        month = "May";
        break;
      case 06:
        month = "Jun";
        break;
      case 07:
        month = "Jul";
        break;
      case 08:
        month = "Aug";
        break;
      case 09:
        month = "Sep";
        break;
      case 10:
        month = "Oct";
        break;
      case 11:
        month = "Nov";
        break;
      case 12:
        month = "Dec";
        break;
      default:
        "";
    }
    dateJoined.textContent = `Joined ${day} ${month} ${year}`;

    // stat box
    repos.textContent = data.public_repos;
    followers.textContent = data.followers;
    following.textContent = data.following;

    // bio
    const bioText = data.bio === null ? "This profile has no bio" : data.bio;
    bio.textContent = bioText;

    // details
    detailIcons.forEach((icon) => {
      // get detail text
      let detailText = document.querySelector(
        `.${icon.dataset.detailCategory}`
      );
      // format blog, company, twitter
      if (icon.dataset.detailCategory === "company") {
        if (data.company?.startsWith("@")) {
          data.company = data.company.slice(1);
        }
        const url = `https://github.com/${data.company}`;
        detailText.textContent = `@${data.company}`;
        detailText.setAttribute("href", url);
      } else if (icon.dataset.detailCategory === "twitter_username") {
        const url = `https://twitter.com/${data.twitter_username}`;
        detailText.textContent = `@${data.twitter_username}`;
        detailText.setAttribute("href", url);
      } else if (icon.dataset.detailCategory === "blog") {
        detailText.textContent = `${data.blog}`;
        detailText.setAttribute("href", data.blog);
      } else if (icon.dataset.detailCategory === "location") {
        detailText.textContent = data[icon.dataset.detailCategory];
      }
    });
    // set null items
    getNA(data);
    // format NA/A data
    formatDetails();
    // clear input
    searchInput.value = "";
  });
}

// search event
searchContainer.addEventListener("submit", searchUser);

// toggle light mode colors on hover
function addActiveClass(e) {
  // check if in dark mode
  if (lightModeImg.classList.contains("dark-sun")) {
    lightModeText.classList.add("dark-active");
    lightModeImg.classList.add("dark-sun-active");
  } else {
    lightModeText.classList.add("light-mode-text-active");
    lightModeImg.classList.add("light-mode-image-active");
  }
}

function removeActiveClass(e) {
  // check if in dark mode
  if (lightModeImg.classList.contains("dark-sun")) {
    lightModeText.classList.remove("dark-active");
    lightModeImg.classList.remove("dark-sun-active");
  } else {
    lightModeText.classList.remove("light-mode-text-active");
    lightModeImg.classList.remove("light-mode-image-active");
  }
}

// change light mode
function switchMode() {
  // toggle dark mode classes
  lightModeImg.classList.toggle("dark-sun");
  logo.classList.toggle("dark-white-text");
  searchContainer.classList.toggle("dark-navy");
  cardContainer.classList.toggle("dark-navy");
  body.classList.toggle("dark-black");
  searchInput.classList.toggle("dark-navy");
  searchInput.classList.toggle("dark-white-text");
  statContainer.classList.toggle("dark-black");
  searchInput.classList.toggle("username-input-dark");
  fullName.classList.toggle("dark-white-text");
  dateJoined.classList.toggle("dark-white-text");
  bio.classList.toggle("dark-white-text");
  statText.forEach((el) => el.classList.toggle("dark-white-text"));
  statNum.forEach((el) => el.classList.toggle("dark-white-text"));
  // format na/a items
  formatDetails();
  // check if in dark & change light mode text/icon
  if (lightModeImg.classList.contains("dark-sun")) {
    lightModeText.textContent = "LIGHT";
    lightModeText.classList.add("dark-white-text");
  } else {
    lightModeText.textContent = "DARK";
    lightModeText.classList.remove("dark-white-text");
    lightModeImg.classList.remove("dark-sun-active");
    lightModeText.classList.remove("dark-active");
  }
}

// hover events for light mode container
lightModeContainer.addEventListener("mouseover", addActiveClass);
lightModeContainer.addEventListener("mouseout", removeActiveClass);
// change light mode
lightModeContainer.addEventListener("click", switchMode);

// set octocat when loaded
window.addEventListener("load", searchUser);
