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
const statContainer = document.querySelector(".stat-container");
const searchInput = document.querySelector(".username-input");
const error = document.querySelector(".error");
class FetchWrapper {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  get(endpoint) {
    return fetch(this.baseURL + endpoint).then((response) => response.json());
  }
}

function searchUser(e) {
  const API = new FetchWrapper(`https://api.github.com/users/`);
  // show octocat on load & if empty search
  const user = searchInput.value === "" ? "octocat" : searchInput.value;
  // get user from the API
  API.get(user).then((data) => {
    console.log(data);

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

    // bio
    const bioText = data.bio === null ? "This profile has no bio" : data.bio;
    bio.textContent = bioText;
    // use diff color if in dark mode
    if (data.bio === null) {
      bio.classList.add("not-available-light");
    } else {
      bio.classList.remove("not-available-light");
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
  });
}

searchInput.addEventListener("change", searchUser);

// toggle light mode colors on hover
function addActiveClass(e) {
  lightModeText.classList.add("light-mode-text-active");
  lightModeImg.classList.add("light-mode-image-active");
}

function removeActiveClass(e) {
  lightModeText.classList.remove("light-mode-text-active");
  lightModeImg.classList.remove("light-mode-image-active");
}

lightModeContainer.addEventListener("mouseover", addActiveClass);

lightModeContainer.addEventListener("mouseout", removeActiveClass);

window.addEventListener("load", searchUser);
