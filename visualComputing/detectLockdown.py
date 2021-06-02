import json
import sys
import os
import argparse
import timeit
from datetime import date
from mqtt.Mqtt import Mqtt
import cv2 as cv
print(cv.__version__)

import systemType as s_type
slash=s_type.type_slash()

def extractImages(video, mqtt, imgDirectory = 'frames'):
    count = 0
    fps = 0.5
    print(video)
    # imgDirectory = imgDirectory + slash + date.today()
    imgDirectory = imgDirectory + slash + video.replace('video'+slash,'').replace('.mp4','')
    print(cv.data.haarcascades)
    path = cv.data.haarcascades + 'haarcascade_frontalface_default.xml' 
    # path = cv.data.haarcascades + 'haarcascade_fullbody.xml' 
    face_classifier = cv.CascadeClassifier(path)
    load = face_classifier.load(path)
    if not load:
        print("erro ao carregar modelo")

    os.makedirs(imgDirectory+slash+'lockdown', exist_ok=True)
    vidcap = cv.VideoCapture(video)
    success = True
    inicio = timeit.default_timer()
    while success:
        vidcap.set(cv.CAP_PROP_POS_MSEC,(count *1000))
        success,frame = vidcap.read()
        if success:
            # cv.imwrite( imgDirectory+slash+"frame%f.jpg" % count, frame)
            # print("frame original salvo")
            
            decorrido = timeit.default_timer()
            mqtt.publish("monitoramento/aovivo",json.dumps(frame.tolist()))
            if( decorrido - inicio > 3):
                image_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
                faces = face_classifier.detectMultiScale(image_gray, 1.3, 5)
                if len(faces) > 0:
                    for(x,y,w,h) in faces:
                        cv.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
                    cv.imwrite( imgDirectory+slash+"lockdown"+slash+"frame%f.jpg" % count, frame)
                    mqtt.publish("monitoramento/lockdown",json.dumps(frame.tolist()))
                    print("Quebra de lockdown detectada: frame salvo")
                '''
                # boddy_classifier 
                bodies = face_classifier.detectMultiScale(image_gray, 1.1, 3)
                if len(bodies) > 0:
                    for (x,y,w,h) in bodies:
                        cv.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 255), 2)
                    cv.imwrite( imgDirectory+slash+"lockdown"+slash+"frame%f.jpg" % count, frame)
                    print("Quebra de lockdown detectada: frame salvo")
                '''
                inicio = timeit.default_timer()
                count = count + 1/fps
        else:
            print("Falha ao abrir o video")
            
def extractImagesByFps(video, mqtt, taxadeQuadros = 27, pularFrames = 1, imgDirectory = 'frames'):
    count = 0
    print(video)
    # imgDirectory = imgDirectory + slash + date.today()
    imgDirectory = imgDirectory + slash + video.replace('video'+slash,'').replace('.mp4','')
    print(cv.data.haarcascades)
    path = cv.data.haarcascades + 'haarcascade_frontalface_default.xml' 
    # path = cv.data.haarcascades + 'haarcascade_fullbody.xml' 
    face_classifier = cv.CascadeClassifier(path)
    load = face_classifier.load(path)
    if not load:
        print("erro ao carregar modelo")

    os.makedirs(imgDirectory+slash+'lockdown', exist_ok=True)
    vidcap = cv.VideoCapture(video)
    success = True
    inicioP = timeit.default_timer()
    inicio = inicioP
    while success:
        vidcap.set(cv.CAP_PROP_POS_FRAMES, count) 
        success,frame = vidcap.read()
        if success:
            if count % (taxadeQuadros*60) == 0:
                print(str(count) + ' frames lidos.')
                fim = timeit.default_timer()
                print ('duracao: %f' % (fim - inicioP))
            
            decorrido = timeit.default_timer()
            mqtt.publish("monitoramento/aovivo",json.dumps(frame.tolist()))
            if( decorrido - inicio > 3):
                image_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
                faces = face_classifier.detectMultiScale(image_gray, 1.3, 5)
                if len(faces) > 0:
                    for(x,y,w,h) in faces:
                        cv.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
                    cv.imwrite( imgDirectory+slash+"lockdown"+slash+"frame%f.jpg" % count, frame)
                    mqtt.publish("monitoramento/lockdown",json.dumps(frame.tolist()))
                    print("Quebra de lockdown detectada: frame salvo")
                inicio = timeit.default_timer()
            count = count + pularFrames
        else:
            print("Falha ao abrir o video")

a = argparse.ArgumentParser()
args = a.parse_args()
print(args)
inicio = timeit.default_timer()
mqtt = Mqtt("node02.myqtthub.com", 1883, "camera1", "tombacity", "tombacity")
extractImages('video'+slash+'Festival-cultura-japonesa-SP.mp4', mqtt)
# extractImagesByFps('video'+slash+'Festival-cultura-japonesa-SP.mp4', mqtt, 30,1)
#extractImagesByFps('video'+slash+'yt1s.com-cctv1.mp4', mqtt, 30)
fim = timeit.default_timer()
print ('duracao: %f' % (fim - inicio))