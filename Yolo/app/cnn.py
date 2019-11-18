from darkflow.net.build import TFNet
import cv2
import numpy as np
import json
# import requests
# import os
# from scipy import misc
# from io import BytesIO
from urllib.request import urlopen

options = {"model": "./cfg/yolo.cfg", "load": "yolov2.weights", "threshold": 0.1, "gpu": 1.0}
tfnet = TFNet(options)
test = [{'label': 'person', 'confidence': 0.3876104, 'topleft': {'x': 991, 'y': 337},
                                                'bottomright': {'x': 1133, 'y': 442}},
        {'label': 'truck', 'confidence': 0.16879167, 'topleft': {'x': 221, 'y': 268},
                                                'bottomright': {'x': 1711, 'y': 732}},
        {'label': 'car', 'confidence': 0.80724114, 'topleft': {'x': 255, 'y': 281},
                                                'bottomright': {'x': 1688, 'y': 755}}
        ]

def yoloFunction(image):
    #url = "https://f1.media.brightcove.com/8/1078702682/1078702682_6004950245001_6004956161001-vs.jpg?pubId=1078702682&videoId=6004956161001"
    #resp = urlopen(url)
    img = np.asarray(image, dtype="uint8")
    img1 = cv2.imdecode(img, cv2.IMREAD_COLOR)
    img2 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
    result = tfnet.return_predict(img2)
    return json.dumps(str(result))

def test_yolo():
    return test

def testOriginalFunction():
    img1 = cv2.imread("./sample_img/car2.png")
    img2 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
    result = tfnet.return_predict(img2)
    return str(result)