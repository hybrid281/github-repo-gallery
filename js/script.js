const overview = document.querySelector(".overview");
const username = "hybrid281";
const repoList = document.querySelector(".repo-list");
const repoInfoAppear = document.querySelector(".repos"); // this is where the repo info appears
const repoDataAppear = document.querySelector(".repo-data"); // this is where the individ repo data will appear


const fetchGithubInfo = async function () {
    const userInfo = await fetch (`https://api.github.com/users/${username}`);
    const data = await userInfo.json(); 
    displayUserInfo(data);
};

fetchGithubInfo();

const displayUserInfo = function(data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
        <figure>
            <img alt="user avatar" src=${data.avatar_url} />
        </figure>
        <div>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Bio:</strong> ${data.bio}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
        </div>
    `;
    overview.append(div);
    gitHubRepos();
};


const gitHubRepos = async function() {
    const fetchRepos = await fetch
        (`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repos = await fetchRepos.json();
    displayRepos(repos);   
};

const displayRepos = function(repos) {
    for(const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

repoList.addEventListener("click", function(e) {
    if (e.target.matches("h3")){
        const repoName = e.target.innerText;
        specRepoInfo(repoName);
    }
});

const specRepoInfo = async function (repoName) {
    const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchInfo.json();
    console.log(repoInfo);
    //languages
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    // pull list of languages
    const languages = [];
    for(const language in languageData) {
        languages.push(language);
    }
    displayRepoInfo(repoInfo, languages);
};

// Use this!! --- languages_url: "https://api.github.com/repos/hybrid281/github-repo-gallery/languages"

const displayRepoInfo = function (repoInfo, languages) {
    repoDataAppear.innerHTML = "";
    const div = document.createElement("div");
    div.innerHTML = `<h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    repoDataAppear.append(div);
    repoDataAppear.classList.remove("hide");
    repoInfoAppear.classList.add("hide");
}