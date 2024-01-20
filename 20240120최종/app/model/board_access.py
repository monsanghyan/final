from app.model.db_interface import DBInterface


class BoardAccess:
    """
    게시판에 관련된 데이터에 접근하는
    Database Access Object(DAO)
    """
    def __init__(self):
        """
        BoardAccess 생성자
        """
        self.db = DBInterface()

    def find_all_category(self):
        """
        모든 카테고리 반환
        """
        self.db.connect()

        result = self.db.fetch_query("""
            SELECT category_id,
                   title,
                   datetime(crt, 'localtime'),
                   datetime(amd, 'localtime')
            FROM Category
            ORDER BY title
        """)

        self.db.disconnect()

        if len(result) == 0:
            return []

        for i in range(len(result)):
            result[i] = {
                'category_id': result[i][0],
                'title': result[i][1],
                'crt': result[i][2],
                'amd': result[i][3]
            }
        return result

    def find_category_by_id(self, category_id):
        """
        ID값을 통해 카테고리를 찾는다
        """
        self.db.connect()

        result = self.db.fetch_query("""
            SELECT category_id,
                   title,
                   datetime(crt, 'localtime'),
                   datetime(amd, 'localtime')
            FROM Category
            WHERE category_id = ?
        """, category_id)

        self.db.disconnect()

        # 검색결과 없으면 None 반환
        if len(result) == 0:
            return None

        # 검색결과 있으면 dictionary 형식으로 반환
        return {
            'category_id': result[0][0],
            'title': result[0][1],
            'crt': result[0][2],
            'amd': result[0][3]
        }

    def create_category(self, title):
        """
        새로운 카테고리를 생성
        """
        self.db.connect()

        self.db.execute_query("""
            INSERT INTO Category(title) 
            VALUES(?)
        """, title)

        self.db.disconnect()

    def create_post(self, category_id, title, content):
        """
        새로운 게시글을 생성
        """
        self.db.connect()

        self.db.execute_query("""
            INSERT INTO Post(category_id, title, content)
            VALUES(?, ?, ?)
        """, category_id, title, content)

        self.db.disconnect()

    def find_all_post(self, category_id):
        """
        카테고리 하위의 모든 게시글 검색
        """
        self.db.connect()

        posts = self.db.fetch_query("""
            SELECT post_id,
                   title,
                   content,
                   datetime(crt, 'localtime'),
                   view,
                   row_number() over(ORDER BY crt ASC)
            FROM Post
            WHERE category_id = ?
            ORDER BY crt DESC
        """, category_id)

        self.db.disconnect()

        if len(posts) == 0:
            return []

        for i in range(len(posts)):
            posts[i] = {
                'post_id': posts[i][0],
                'title': posts[i][1],
                'content': posts[i][2],
                'crt': posts[i][3],
                'view': posts[i][4],
                'no': posts[i][5]
            }

        return posts

    def find_post_by_id(self, post_id):
        """
        특정 게시글을 불러온다
        """
        self.db.connect()

        result = self.db.fetch_query("""
            SELECT p.post_id,
                    p.title,
                    p.content,
                    datetime(p.crt, 'localtime'),
                    datetime(p.amd, 'localtime'),
                    p.view,
                    c.title
            FROM Post p
            LEFT JOIN Category c
                    ON p.category_id = c.category_id
            WHERE p.post_id = ?
        """, post_id)

        self.db.disconnect()

        if len(result) == 0:
            return None
        return {
            'post_id': result[0][0],
            'title': result[0][1],
            'content': result[0][2],
            'crt': result[0][3],
            'amd': result[0][4],
            'view': result[0][5],
            'category': result[0][6]
        }