// work on details icons/text for dark mode reg & NA

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
const detailText = [...document.querySelectorAll(".detail-text")];

class FetchWrapper {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  get(endpoint) {
    return fetch(this.baseURL + endpoint).then((response) => response.json());
  }
}

function searchUser(e) {
  e.preventDefault();
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

    userImg.src = data.avatar_url;

    // show username for name if null
    if (data.name === null) {
      const name = data.login;
      fullName.textContent = name;
    } else {
      fullName.textContent = data.name;
    }

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
        month = "March";
        break;
      case 04:
        month = "April";
        break;
      case 05:
        month = "May";
        break;
      case 06:
        month = "June";
        break;
      case 07:
        month = "July";
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

    // bio validate
    const bioText = data.bio === null ? "This profile has no bio" : data.bio;
    bio.textContent = bioText;
    if (data.bio === null) {
      bio.classList.add("not-available-light");
    } else {
      bio.classList.remove("not-available-light");
      bio.classList.remove("not-available-dark");
    }

    // stat box
    repos.textContent = data.public_repos;
    followers.textContent = data.followers;
    following.textContent = data.following;

    // find null details
    const nullIcons = [];
    for (const key in data) {
      if (key === "location" && data[key] === null) {
        nullIcons.push(key);
      }
      if (key === "blog" && data[key] === "") {
        nullIcons.push(key);
      }
      if (key === "twitter_username" && data[key] === null) {
        nullIcons.push(key);
      }
      if (key === "company" && data[key] === null) {
        nullIcons.push(key);
      }
    }

    // set icons/text/color for N/A details
    // change if dark mode
    // const darkModeOn = lightModeImg.classList.contains("dark-sun");

    detailIcons.forEach((icon) => {
      let el = document.querySelector(`.${icon.dataset.detailCategory}`);
      if (nullIcons.includes(icon.dataset.detailCategory)) {
        el.classList.add("not-available-light");
        el.textContent = "Not available";
        icon.src = `assets/icon-${icon.dataset.detailCategory}-light-NA.svg`;
      } else {
        el.classList.remove("not-available-light");
        icon.src = `assets/icon-${icon.dataset.detailCategory}.svg`;

        // format blog, company, twitter
        if (icon.dataset.detailCategory === "company") {
          if (data.company.startsWith("@")) {
            data.company = data.company.slice(1);
          }
          const url = `https://github.com/${data.company}`;
          el.innerHTML = `<a href="${url}">@${data.company}</a>`;
        } else if (icon.dataset.detailCategory === "twitter_username") {
          const url = `https://twitter.com/${data.twitter_username}`;
          el.innerHTML = `<a href="${url}">@${data.twitter_username}</a>`;
        } else if (icon.dataset.detailCategory === "blog") {
          el.innerHTML = `<a href="${data.blog}">${data.blog}</a>`;
        } else {
          el.textContent = data[icon.dataset.detailCategory];
        }
      }
    });

    // clear input
    searchInput.value = "";
  });
}

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

// change text-img on light mode container
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
  detailIcons.forEach(
    (el) => (el.src = `assets/icon-${el.dataset.detailCategory}-dark.svg`)
  );
  detailText.forEach((el) => el.classList.toggle("dark-white-text"));

  // check if in dark & change light mode text/icon
  if (lightModeImg.classList.contains("dark-sun")) {
    lightModeText.textContent = "LIGHT";
    lightModeText.classList.add("dark-white-text");

    // if bio is NA change text color & content
    if (bio.textContent === "This profile has no bio") {
      bio.classList.add("not-available-dark");
    }

    // change NA icons/text
    // const detailsNA = detailText.filter(
    //   (el) => el.textContent === "Not available"
    // );

    // detailsNA.forEach((el) => el.classList.add("not-available-dark"));

    // detailIcons.forEach((el) => {
    //   detailsNA.forEach((p) => {
    //     if (p.classList.contains(el.dataset.detailCategory)) {
    //       el.src = `assets/icon-${el.dataset.detailCategory}-dark-NA.svg`;
    //     }
    //   });
    // });
  } else {
    lightModeText.textContent = "DARK";
    lightModeText.classList.remove("dark-white-text");
    lightModeImg.classList.remove("dark-sun-active");
    lightModeText.classList.remove("dark-active");
  }
}

lightModeContainer.addEventListener("mouseover", addActiveClass);

lightModeContainer.addEventListener("mouseout", removeActiveClass);

lightModeContainer.addEventListener("click", switchMode);

window.addEventListener("load", searchUser);
