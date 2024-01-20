from github import Github, Auth


class GithubService:
    """
    깃 허브 API 처리 서비스
    """
    def __init__(self):
        """
        GithubService 생성자\n
        Github 에서 발급 받은 개인 엑세스 토큰을 통해 Github API 서비스에 접근
        """
        self.g = Github(auth=Auth.Token('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'))

    def get_user_info(self):
        """
        Github 사용자의 기본 정보를 반환한다.
        """
        user = self.g.get_user()
        return {
            'nickname': user.login,
            'name': user.name,
            'email': user.email,
            'bio': user.bio,
            'img': user.avatar_url,
            'url': user.html_url
        }

    def get_repo_list(self):
        """
        Github에 등록된 repository 목록을 반환한다.
        """
        repo = self.g.get_user().get_repos()
        repo_list = []
        for r in repo:
            repo_list.append({
                'title': r.name,
                'url': r.html_url,
                'visibility': r.visibility,
                'lang': r.language
            })
        return repo_list

    def get_gist_list(self):
        """
        Github에 등록된 gist 목록을 반환한다.
        """
        gist = self.g.get_user().get_gists()
        gist_list = []
        for g in gist:
            for filename in g.files.keys():
                gist_list.append({
                    'filename': filename,
                    'url' : g.html_url
                })
        return gist_list