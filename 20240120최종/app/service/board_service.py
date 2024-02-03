from app.model.board_access import BoardAccess


class BoardService:
    """
    게시판 관련 비즈니스 로직을 처리하는 서비스 클래스
    """
    def __init__(self):
        self.board_access = BoardAccess()

    def get_categories(self):
        """
        모든 게시판을 불러온다
        """
        return self.board_access.find_all_category()

    def add_post(self, category_id, title, content):
        """
        게시글을 추가한다
        """
        self.board_access.create_post(category_id, title, content)

    def get_post(self, post_id):
        """
        특정 게시물을 불러온다
        """
        return self.board_access.find_post_by_id(post_id)

    def get_posts(self, category_id):
        """
        카테고리 하위의 게시글을 불러온다
        """
        return self.board_access.find_all_post(category_id)

    def count_post(self, category_id):
        """
        카테고리 하위의 모든 게시글 개수 집계
        """
        return self.board_access.count_post_by_category_id(category_id)
