let quill = null;

window.addEventListener('DOMContentLoaded', function() {
    // Quill 에디터 초기화
    quill = new Quill('#editor', {
        modules: {
            toolbar: false,
        },
        readOnly: true,
        bounds: '#editor',
    });
    // URL 파라미터 가져오기
    let urlSearchParams = new URLSearchParams(window.location.search);
    let params = {};
    for (let [key, value] of urlSearchParams) {
        params[key] = value;
    }
    loadPost(params.post_id);

    // back버튼 클릭시 이벤트
    let back = document.querySelector('#back');
    back.addEventListener('click', function(evt) {
        window.location = `/board?category_id=${params.category_id}`;
    });

});

async function loadPost(post_id) {
    let response = await fetch(`/board-api/post?post_id=${post_id}`, {
        method : 'GET',
        headers: {'Content-Type': 'application/json'},
    });
    let post = await response.json();
    
    let category = document.querySelector('#category');
    let title = document.querySelector('#title');
    let etc = document.querySelector('#etc');

    category.innerText = post.category;
    title.innerText = post.title;
    etc.innerText = `작성일: ${post.crt} | 수정일: ${post.amd} | 조회수: ${post.view}`;
    quill.root.innerHTML = post.content;
}