FROM python:3.6-buster

ENV FLASK_APP app/flaskAPI.py

COPY yolov2.weights .
COPY cfg ./cfg
COPY app ./app

RUN pip install flask cython tensorflow==1.14.0 opencv-python numpy scipy
RUN git clone https://github.com/thtrieu/darkflow.git
RUN pip install ./darkflow/

EXPOSE 5000

CMD [ "flask", "run" ]