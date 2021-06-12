import os
import argparse
import timeit, time
from datetime import date

import cv2 as cv
print(cv.__version__)

import systemType as s_type
slash=s_type.type_slash()

import imutils
from imutils.video import VideoStream
from imutils.video import FPS


def extractImages(imgDirectory = 'frames'):
    count = 0
    fps_s = 10 
    imgDirectory = imgDirectory + slash + 'real_time_face_detection'
    print(cv.data.haarcascades)
    path = cv.data.haarcascades + 'haarcascade_frontalface_default.xml' 
    # path = cv.data.haarcascades + 'haarcascade_fullbody.xml' 

    classifier = cv.CascadeClassifier(path)
    load = classifier.load(path)
    if not load:
        print("erro ao carregar modelo")

    os.makedirs(imgDirectory+slash+'lockdown', exist_ok=True)
    success = True
    inicio = timeit.default_timer()

    # initialize the video stream, allow the cammera sensor to warmup,
    # and initialize the FPS counter
    print("[INFO] starting video stream...")
    vs = VideoStream(src=0).start()
    time.sleep(2.0)
    fps = FPS().start()

    while success:
        # grab the frame from the threaded video stream and resize it
        # to have a maximum width of 400 pixels
        frame = vs.read()
        frame = imutils.resize(frame, width=400)
            
        decorrido = timeit.default_timer()
        if( decorrido - inicio > 3):
            image_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
            
            # face_classifier 
            faces = classifier.detectMultiScale(image_gray, 1.3, 5)
            if len(faces) > 0:
                for(x,y,w,h) in faces:
                    cv.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
                cv.imwrite( imgDirectory+slash+"lockdown"+slash+"frame%f.jpg" % count, frame)
                print("Quebra de lockdown detectada: frame salvo")
            '''
            # boddy_classifier 
            bodies = classifier.detectMultiScale(image_gray, 1.1, 3)
            if len(bodies) > 0:
                for (x,y,w,h) in bodies:
                    cv.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 255), 2)
                cv.imwrite( imgDirectory+slash+"lockdown"+slash+"frame%f.jpg" % count, frame)
                print("Quebra de lockdown detectada: frame salvo")
            '''
            inicio = timeit.default_timer()
            count = count + 1

        # show the output frame
        cv.imshow("Frame", frame)
        key = cv.waitKey(1) & 0xFF
        # if the `q` key was pressed, break from the loop
        if key == ord("q"):
            break
        # update the FPS counter
        fps.update()

    # stop the timer and display FPS information
    fps.stop()
    print("[INFO] elapsed time: {:.2f}".format(fps.elapsed()))
    print("[INFO] approx. FPS: {:.2f}".format(fps.fps()))

a = argparse.ArgumentParser()
args = a.parse_args()
print(args)
inicio = timeit.default_timer()
extractImages()
fim = timeit.default_timer()
print ('duracao: %f' % (fim - inicio))
