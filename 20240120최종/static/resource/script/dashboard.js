/////////////////////////////////////////////////////////////////////
// 페이지 로드시 실행

window.addEventListener('DOMContentLoaded', function() {
    loadProfile();
    loadRepositories();
    loadGists();
});

/////////////////////////////////////////////////////////////////////
//

async function loadProfile() {
    let response = await fetch('/github/user', { method: 'GET' });
    let user     = await response.json();

    let profileImg   = document.querySelector('#profile-img');
    let profileName  = document.querySelector('#profile-name');
    let profileEmail = document.querySelector('#profile-email');
    let profileBio   = document.querySelector('#profile-bio');
    let profileUrl   = document.querySelector('#profile-url');

    profileImg.src         = user.img;
    profileName.innerText  = user.nickname + ` ${user.name ?? ''}`;
    profileEmail.innerText = user.email;
    profileBio.innerText   = user.bio;
    profileUrl.href        = user.url;
}

async function loadRepositories() {
    let response = await fetch('/github/repo', { method: 'GET' });
    let repoList = await response.json();

    let repositories = document.querySelector('#repositories');
    for (let repo of repoList) {
        let listItem = document.createElement('div');
        listItem.className = 'list-item';
        listItem.innerHTML = `
            <a class="repo-title" href=${repo.url} target="_blank">${repo.title}</a>
            <div class="repo-language">${repo.lang ?? ''}</div>
            <div class="repo-visibility">${repo.visibility}</div>
        `;
        repositories.append(listItem);
    }
}

async function loadGists() {
    let response = await fetch('/github/gist', { method: 'GET' });
    let gistList = await response.json();

    let gists = document.querySelector('#gists');
    const maxCount = 30;
    let count = 0;
    for (let gist of gistList) {
        if (maxCount < count) break;
        let fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <a class="file-icon" id="file-item-${++count}" href="${gist.url}" target="_blank"></a>
            <label class="filename" for="#file-item-${count}">${gist.filename}</label>
        `;

        gists.append(fileItem);
    }
}