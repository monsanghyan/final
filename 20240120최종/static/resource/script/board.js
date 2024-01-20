let params = {};
window.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    //[[기존 호출 삭제]]

    //url 파라미터 불러오기
    let urlSearchParams = new URLSearchParams(window.location.search);
    for (let [key, value] of urlSearchParams) {
        params[key] = value;
    }
    //category_id가 있다면 게시글 리스트 출력
    if (params.category_id !== undefined){
        loadPosts(params.category_id);
    }
});

/**
 * 카테고리 불러오기
 */
async function loadCategories() {
    let response = await fetch('/board-api/category', {
        method : 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    let categories = await response.json();

    let categoryList = document.querySelector('#category-list');

    for (let category of categories) {
        let a = document.createElement('a');
        a.className = 'category';
        a.innerText = category.title;

        //[[클릭이벤트 추가]]
        a.addEventListener('click', function(){
            loadPosts(category.category_id);
        });
        categoryList.append(a);

    }
}

/**
 * 게시글 불러오기
 */
//[[파라미터 추가]]
async function loadPosts(category_id) {
    let response = await fetch(`/board-api/posts?category_id=${category_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let posts = await response.json();
    let postList = document.querySelector('#post-list');
    //[[데이터 출력 전 기존 목록 삭제]]
    postList.innerHTML = '';
    for (let post of posts) {
        let a = document.createElement('a');
        a.className = 'post';
        a.href = `/board/read?post_id=${post.post_id}&category_id=${category_id}`;

        let divNo = document.createElement('div');
        divNo.className = 'w10 txt-center';
        divNo.innerText = post.no;
        a.append(divNo);

        let divTitle = document.createElement('div');
        divTitle.className = 'w70 txt-left';
        divTitle.innerText = post.title;
        a.append(divTitle);

        let divCrt = document.createElement('div');
        divCrt.className = 'w10 txt-center';
        divCrt.innerText = post.crt.substring(0,10);
        a.append(divCrt);

        let divView = document.createElement('div');
        divView.className = 'w10 txt-center';
        divView.innerText = post.view;
        a.append(divView);

        postList.append(a);
    }

}