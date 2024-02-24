/////////////////////////////////////////////////////////////////////
// 페이지 로드시 실행
let currentIframe = null;
// DomContentLoaded와 load의 차이:
window.addEventListener('DOMContentLoaded', function() {
    initNavbar();

    // 페이지 로드 직후 바로 대시보드 불러오기
    let pageWrap = document.querySelector('#page-wrap');
    let iframe = document.createElement('iframe');
    iframe.className = 'page-iframe';
    iframe.src = '/dashboard';

    currentIframe = iframe;
    pageWrap.append(iframe);
});
/////////////////////////////////////////////////////////////////////

// 공통 컴포넌트 초기화 함수

/**
 * 내비게이션 바 초기화
 */
function initNavbar() {
    // 내비게이션 바
    let navbar = document.querySelector('#navbar');

    // 내비게이션 바에 동적 메뉴 추가시 감지 및 클릭 이벤트 등록
    let navbarObserver = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === "childList") {
                for (let node of mutation.addedNodes) {
                    node.addEventListener('click', onNavMenuClick1);
                }
            }
        }
    });

    navbarObserver.observe(navbar, { childList: true });

    // 이미 있는 메뉴 클릭 이벤트 등록
    let navMenuList = navbar.querySelectorAll('.nav-menu');
    for (let navMenu of navMenuList) {
        navMenu.addEventListener('click', onNavMenuClick1);
    }
}



/////////////////////////////////////////////////////////////////////
// 공통 컴포넌트 클릭 이벤트 핸들러

/**
 * 내비게이션 메뉴 클릭 핸들러
 * @param {MouseEvent} event - 클릭 이벤트 객체
 */
function onNavMenuClick1(event) {
    // 기본 이벤트 방지
    event.preventDefault();
    
    // 메뉴에서 on 클래스 일관 제거
    let navMenuList = document.querySelectorAll('#navbar > .nav-menu');
    for (let navMenu of navMenuList) {
        navMenu.classList.remove('on');
    }

    // 누른 항목 on 클래스 추가
    event.target.classList.add('on');

    // iframe 페이지 로드
    let pageWrap = document.querySelector('#page-wrap');
    let iframe = document.createElement('iframe');
    iframe.className = 'page-iframe';
    iframe.src = event.target.getAttribute('href');

    if (currentIframe) {
        currentIframe.remove();
    }
    currentIframe = iframe;
    pageWrap.append(iframe);
}