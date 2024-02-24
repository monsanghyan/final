let params = {};

const pagination = {
    total       : 0,                    // 총 게시글 개수
    totalpage   : 0,                    // 총 페이지 번호
    maxPost     : 2,                   // 최대 표시 가능한 게시글 개수
    maxList     : 5,                    // 최대 페이지 리스트 개수
    currPage    : 1,                    // 현재 페이지 번호
    currRange   : {start: 0, end: 0},   // 현재 페이지 리스트 범위
    category_id : '',                   // 현재 카테고리 id
};
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
            // loadPosts(category.category_id);
            // countPost(category.category_id);
            paginationInit(category.category_id);
        });
        categoryList.append(a);

    }
}

/**
 * 게시글 불러오기
 */
//[[파라미터 추가]]
async function loadPosts(category_id, max_post, page) {
    let response = await fetch(
        `/board-api/posts?category_id=${category_id}&max_post=${max_post}&page=${page}`, {
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

/**
 * 게시글 집계하기
 */
async function countPost(category_id) {
    let response = await fetch(
        `/board-api/post/count?category_id=${category_id}`,
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }
    );

    let result = await response.json();

    console.log(result);

    return result.count;
}

/**
 * 페이지네이션 초기화
 */
async function paginationInit(category_id) {
    pagination.total     = await countPost(category_id);
    pagination.totalpage = Math.ceil(pagination.total / pagination.maxPost);
    pagination.currPage  = 1;

    pagination.currRange.start  = 1;
    pagination.currRange.end    = Math.min(pagination.totalpage, pagination.maxList);

    

    pagination.category_id = category_id;

    setupPageList();

}

/**
 * 페이지 리스트 설정
 */
function setupPageList() {
    let pageList = document.querySelector('#page-list');

    // 구조분해 할당 (객체의 속성을 구조를 분해하여 변수로 바로 받음)
    let {start, end} = pagination.currRange;

    pageList.innerHTML = ''; // 기존 페이지 번호 제거
    for (let num = start; num <= end; num++) {
        let pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        pageDiv.innerText = num;
        pageDiv.setAttribute('data-value', num);
        pageDiv.addEventListener('click', function() {
            setPage(num)
        });

        pageList.append(pageDiv);
    }
}

function setPage(num) {

    // 페이지 번호가 현재 페이지 그룹을 벗어났을 때 ex) 페이지리스트가 1,2,3,4,5인데 6번 페이지로 이동할 때
    // 6,7,8,9,10으로 페이지리스트를 변경해 준다.
    // 단, 1,2,3,4,5 리스트에서 8번으로 이동할때도 동일하게 
    // 페이지 리스트는 6,7,8,9,10이 되어야 한다.
    // 그럼 여기서 start와 end 범위 그리고 num을 보고 
    // start와 end를 수정 후 setupList를 호출하면 끝! -- 숙제--

    // 내가 누른 페이지 번호
    let pageDiv = document.querySelector(`.page[data-value="${num}"]`);
    // 내가 누르지 않은 패이지 번호
    let otherPageDiv = document.querySelectorAll(`.page:not([data-value="${num}"])`);

    // 누른 번호 표시
    if (pageDiv != null) {
        pageDiv.className += ' on';
    }
    // 누르지 않은 번호 표시 제거
    for (let other of otherPageDiv) {
        other.className = other.className.replace(' on', '');
    }

    pagination.currPage = num;
    loadPosts(pagination.category_id, pagination.maxPost, num);
}