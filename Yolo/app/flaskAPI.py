#!flask/bin/python
from flask import Flask, jsonify, request
#import valueTesting
from app.cnn import yoloFunction, test_yolo

app = Flask(__name__)

@app.route('/')
def hello():
    return jsonify({"about": "Hello World"})

@app.route('/testYolo')
def testYolo():
    result = test_yolo()
    return jsonify({"yolo": result})


@app.route('/getYolo', methods=['POST'])
def getYolo():
    #get byte array from requests
    request_data = request.get_json()
    img = request_data['yolo']
    result = yoloFunction(img)
    return jsonify({"result": result})


if __name__ == '__main__':
    app.run(host='127.0.0.1',port=5000,debug=True)
