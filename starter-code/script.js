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
const website = document.querySelector(".website");
const company = document.querySelector(".company");
const twitter = document.querySelector(".twitter");
const detailIcons = document.querySelectorAll(".detail-icon");
const body = document.querySelector("body");
const cardContainer = document.querySelector(".user-card-container");
const searchContainer = document.querySelector(".search-container");
const statContainer = document.querySelector(".stat-container");
const searchInput = document.querySelector(".username-input");

class FetchWrapper {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  get(endpoint) {
    return fetch(this.baseURL + endpoint).then((response) => response.json());
  }
}

function searchUser(e) {
  const user = new FetchWrapper(`https://api.github.com/users/`);
  user.get(searchInput.value).then((data) => {
    // format!
    userImg.src = data.avatar_url;
    fullName.textContent = data.name;
    userName.textContent = data.login;
    dateJoined.textContent = data.created_at;
    bio.textContent = data.bio;
    repos.textContent = data.public_repos;
    followers.textContent = data.followers;
    following.textContent = data.following;
    city.textContent = data.location;
    website.textContent = data.blog;
    twitter.textContent = data.twitter_username;
    company.textContent = data.company;
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
