FROM python:3.6

ENV FLASK_APP app/flaskAPI.py
ENV FLASK_RUN_HOST 0.0.0.0

EXPOSE 5000

COPY yolov2.weights .
COPY cfg ./cfg
COPY app /app/
COPY sample_img ./sample_img

RUN pip install flask cython tensorflow==1.14.0 opencv-python numpy scipy
RUN git clone https://github.com/thtrieu/darkflow.git
RUN pip install ./darkflow/

CMD [ "flask", "run" ]