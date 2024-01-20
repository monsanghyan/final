"""
게시판 관련 요청 컨트롤러
"""
from flask import Blueprint, jsonify, request
from app.service.board_service import BoardService

board_service = BoardService()
board_bp = Blueprint('BoardController', __name__)


@board_bp.route('/category')
def category_list():
    categories = board_service.get_categories()
    return jsonify(categories)

@board_bp.route('/post')
def post_read():
    post_id = request.args.get('post_id')
    post = board_service.get_post(post_id)
    return jsonify(post)

@board_bp.route('/post', methods=['POST'])
def post_write():
    param = request.get_json()  # 요청 Body를 JSON 형식으로 해석
    board_service.add_post(
        param['category_id'],
        param['title'],
        param['content']
    )
    return jsonify({'state': 'success'})


@board_bp.route('/posts')
def post_list():
    posts = board_service.get_posts(request.args.get('category_id'))
    return jsonify(posts)
