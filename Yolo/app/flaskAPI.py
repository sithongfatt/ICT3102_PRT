from flask import Flask, jsonify, request
from app.objectDetection import yoloFunction, test_yolo

app = Flask(__name__)

## ----------------- For testing purposes ----------------------

@app.route('/')
def hello():
    return jsonify({"about": "Hello World"})

@app.route('/testYolo')
def testYolo():
    result = test_yolo()
    return jsonify({"yolo": result})

## -------------------------------------------------------------

@app.route('/getYolo', methods=['POST'])
def getYolo():
    ## Retrieve backend data passed through json and send it over to 
    request_data = request.get_json()
    img = request_data.get('yolo')
    return yoloFunction(img)


if __name__ == '__main__':
    app.run(debug=True)
