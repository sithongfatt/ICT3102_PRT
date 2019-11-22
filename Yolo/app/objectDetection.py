from darkflow.net.build import TFNet
import cv2
import numpy as np
import json
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


def test_yolo():
    return test


def yoloFunction(image):
    img = np.asarray(image, dtype="uint8")
    img1 = cv2.imdecode(img, cv2.IMREAD_COLOR)
    img2 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
    result = tfnet.return_predict(img2) 
    return json.dumps(str(result)) 
