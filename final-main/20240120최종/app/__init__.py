from flask import Flask

from .controller.page_controller import page_bp
from .controller.github_controller import github_bp
from .controller.board_controller import board_bp

app = Flask(__name__, static_folder="../static/resource")

app.register_blueprint(page_bp)
app.register_blueprint(github_bp, url_prefix='/github')
app.register_blueprint(board_bp, url_prefix='/board-api')
