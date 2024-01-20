let quill = null;

window.addEventListener('DOMContentLoaded', function() {
    // Quill 에디터 초기화
    quill = new Quill('#editor', {
        theme: 'snow'
    });

    loadCategoryDropdown();

    // Submit 버튼 클릭시 동작
    let submit = document.querySelector('#submit');
    submit.addEventListener('click', function() { 
        // 버튼을 누르면 일단 버튼을 비활성화
        submit.setAttribute('disabled', '');
        submitPost().finally(function() {
            // 요청이 완전히 끝났을때 다시 활성화
            submit.removeAttribute('disabled');
        });
    });

});

/**
 * 카테고리 드롭다운 초기화
 */
async function loadCategoryDropdown() {
    let response = await fetch('/board-api/category', {
        method : 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    let categories = await response.json();

    let dropdown = document.querySelector('#category');

    for (let category of categories) {
        let option       = document.createElement('option');
        option.value     = category.category_id;
        option.innerText = category.title;

        dropdown.append(option);
    }
}


/**
 * 게시글 전송
 */
async function submitPost() {
    let category_id = document.querySelector('#category').value;
    let title       = document.querySelector('#title').value;
    let content     = quill.root.innerHTML;

    try {
        let response = await fetch('/board-api/post', {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body   : JSON.stringify({
                category_id: category_id,
                title      : title,
                content    : content
            })
        });

        let result = await response.json();
        
        location.href = '/board';
    } catch(e) {
        alert('에러가 발생했습니다. 관리자에게 문의하세요.');
    }
}
