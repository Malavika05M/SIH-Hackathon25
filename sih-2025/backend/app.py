from flask import Flask, request, jsonify,session
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = '12345'
CORS(app,supports_credentials=True)

@app.route("/test")
def test():
    return(jsonify({"Res":"Test Done"}));


if __name__ == '__main__':
    app.run(debug=True)