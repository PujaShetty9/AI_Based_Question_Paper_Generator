import os
from flask import Flask, jsonify
from flask_cors import CORS

from routes.subjects import subjects_bp
from routes.paper import paper_bp
from routes.answers import answers_bp
from routes.edit import edit_bp

app = Flask(__name__)

# Configure CORS for all origins and all routes
app.config["CORS_HEADERS"] = "Content-Type"
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=False)

app.register_blueprint(subjects_bp)
app.register_blueprint(paper_bp)
app.register_blueprint(answers_bp)
app.register_blueprint(edit_bp)


@app.route("/")
def home():
    return jsonify({"message": "AI Question Paper Generator Backend is running"})


@app.errorhandler(ConnectionError)
def handle_db_error(e):
    return jsonify({"success": False, "message": str(e)}), 500


@app.errorhandler(Exception)
def handle_generic_error(e):
    return jsonify({"success": False, "message": str(e)}), 500


if __name__ == "__main__":
    debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug_mode)