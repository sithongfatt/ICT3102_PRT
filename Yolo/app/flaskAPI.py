#!flask/bin/python
from flask import Flask, jsonify, request
import socket
#import valueTesting
from app.objectDetection import yoloFunction, test_yolo, testOriginalFunction
import sys
app = Flask(__name__)

@app.route('/')
def hello():
    return jsonify({"about": "Hello World"})

@app.route('/testYolo')
def testYolo():
    result = test_yolo()
    return jsonify({"yolo": result})

@app.route('/testLoadBalancer')
def testLoadBalancer():
    return socket.gethostname()

@app.route('/test-original')
def testOriginalYolo():
    result = testOriginalFunction() 
    return jsonify({"yolo": result})

@app.route('/getYolo', methods=['POST'])
def getYolo():
    #get byte array from requests
    request_data = request.get_json()
    # print(request_data, file=sys.stderr)
    img = request_data.get('yolo')
    # print("-----", file=sys.stderr)
    # print(img, file=sys.stderr)
    return yoloFunction(img)
    # print("-----", file=sys.stderr)
    # print(result, file=sys.stderr)

    # return jsonify({"result":result})


if __name__ == '__main__':
    app.run(debug=True)
