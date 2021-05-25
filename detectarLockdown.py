import sys
import os
import argparse
from datetime import date

import cv2 as cv
print(cv.__version__)


def extractImages(video, imgDirectory = 'frames'):
    count = 0
    fps = 1  
    # quantidade de frames capturados por segundo do video... ava anderson
    # imgDirectory = imgDirectory + '\\' + date.today()
    imgDirectory = imgDirectory + '\\' + video.replace('video\\','').replace('.mp4','')
    path = cv.data.haarcascades + 'haarcascade_frontalface_default.xml' 
    face_classifier = cv.CascadeClassifier(path)
    teste = face_classifier.load(path)
    if not teste:
        print("erro ao carregar modelo")
        
    os.makedirs(imgDirectory, exist_ok=True)
    os.makedirs(imgDirectory + '\\lockdown', exist_ok=True)
    vidcap = cv.VideoCapture(video)
    success = True
    while success:
        vidcap.set(cv.CAP_PROP_POS_MSEC,( count *1000)) 
        success,frame = vidcap.read()
        if success:
            cv.imwrite( imgDirectory + "\\frame%f.jpg" % count, frame)
            print("frame original salvo")
            
            image_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
            faces = face_classifier.detectMultiScale(image_gray, 1.3, 5)
            if len(faces) > 0:
                for(x,y,w,h) in faces:
                    cv.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
                cv.imwrite( imgDirectory + "\\lockdown\\frame%f.jpg" % count, frame)
                print("Quebra de lockdown detectada: frame salvo")
            count = count + 1/fps

a = argparse.ArgumentParser()
args = a.parse_args()
print(args)
extractImages('video\Festival-cultura-japonesa-SP.mp4')