import json
import sys
import os
import argparse
import timeit
import datetime
import time
from mqtt.Mqtt import Mqtt
import cv2 as cv
print(cv.__version__)

import systemType as s_type
slash=s_type.type_slash()
from imutils.video import VideoStream
from imutils.video import FPS
import imutils
import io
from imutils import opencv2matplotlib
from PIL import Image
from ThreadMqtt import ThreadMqtt;

configFile=os.path.dirname(os.path.realpath(__file__))+"/config/config.json"
CONFIG = json.loads(open(configFile, 'r').read())

def openClassifier():
    print(cv.data.haarcascades)
    path = cv.data.haarcascades + 'haarcascade_frontalface_default.xml' 
    # path = cv.data.haarcascades + 'haarcascade_fullbody.xml' 
    classifier = cv.CascadeClassifier(path)
    load = classifier.load(path)
    if not load:
        print("erro ao carregar modelo")
    return classifier

def useVideoCapture(imgDirectory):
    video = 'video'+slash+CONFIG['video']
    print(video)
    imgDirectory = imgDirectory + slash + video.replace('video'+slash,'').replace('.mp4','')
    os.makedirs(imgDirectory+slash+'lockdown', exist_ok=True)
    return cv.VideoCapture(video)

def useVideoStream(imgDirectory):
    imgDirectory = imgDirectory + slash + 'real_time_face_detection'
    os.makedirs(imgDirectory+slash+'lockdown', exist_ok=True)

    # inicializa o stream de video pela câmera 
    print("[INFO] starting video stream...")
    vs = VideoStream(src=0).start()
    time.sleep(2.0)
    return vs 

def pil_image_to_byte_array(image):
    imgByteArr = io.BytesIO()
    image.save(imgByteArr, "PNG")
    return imgByteArr.getvalue()

def get_now_string():
    return datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S.%f")

def imageToPublishableObj(frame):
    # return frame.tolist()
    np_array_RGB = opencv2matplotlib(frame)
    image = Image.fromarray(np_array_RGB)
    return pil_image_to_byte_array(image)
    byte_array = pil_image_to_byte_array(image)
    #return {'date': get_now_string(), 'data': str(byte_array) }

def extractImages(mqtt, type=1, imgDirectory = 'frames'):
    face_classifier = openClassifier()
    count = 0
    success = True
    inicio = timeit.default_timer()
    hora_inicial = datetime.datetime.strptime(CONFIG['time']['init'], "%H:%M:%S").time()
    hora_final = datetime.datetime.strptime(CONFIG['time']['finish'], "%H:%M:%S").time()
    
    # thread = ThreadMqtt(mqtt, CONFIG)
    # thread.start()
    
    if type == 1:
        video = useVideoCapture(imgDirectory)
    else: 
        video = useVideoStream(imgDirectory)
    fps = FPS().start()

    while success:
        time.sleep(1)
        if type == 1:
            # inicio = timeit.default_timer()
            # video.set(cv.CAP_PROP_POS_MSEC,(count *1000)) #por segundo
            # video.set(cv.CAP_PROP_POS_FRAMES,count)#todos os frames do video
            success,frame = video.read()
            if not success:
                print("Falha ao abrir o video")
                continue
            # fim = timeit.default_timer()
            # print('duracao da captura do frame pelo video: %f' % (fim - inicio))
        else : 
            # inicio = timeit.default_timer()
            frame = video.read()
            # fim = timeit.default_timer()
            # print('duracao da captura do frame pela camera: %f' % (fim - inicio))
        frame = imutils.resize(frame, width=300, height=300)

        cv.imwrite( imgDirectory+slash+"frame%f.jpg" % count, frame)
        decorrido = timeit.default_timer()
        # inicio = timeit.default_timer()
        thread = ThreadMqtt(frame, mqtt, CONFIG)
        thread.start()
        
        # message = imageToPublishableObj(frame)
        # mqtt.publisher(CONFIG['topics']['lockdown'], message, CONFIG['mqtt']['qos'] )
        # fim = timeit.default_timer()
        # print('duracao da conversão do frame: %f' % (fim - inicio))
        # print("frame publicado no topico: ", CONFIG['topics']['aovivo'])
        agora = datetime.datetime.now().time()
        if( decorrido - inicio >= 3
           and ( 
                ( hora_inicial < hora_final and hora_inicial <= agora <= hora_final) or #o horario definido dentro do mesmo dia, por exemplo 10:00:00 as 22:00:00
                ( hora_inicial > hora_final and ( hora_inicial <= agora or agora <= hora_final) )#o horaario definido começa em um dia e acaaba no proximo, por exemplo 18:00:00 as 02:00:00
            )
           ):
            # print('teste')
            image_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
            faces = face_classifier.detectMultiScale(image_gray, 1.3, 5)
            if len(faces) > 0:
                for(x,y,w,h) in faces:
                    cv.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
                cv.imwrite( imgDirectory+slash+"lockdown"+slash+"frame%f.jpg" % count, frame)
                thread = ThreadMqtt(frame, mqtt, CONFIG, 0, True)
                thread.start()
                print("Quebra de lockdown detectada publicada no topico: ", CONFIG['topics']['lockdown'] )
                inicio = timeit.default_timer()

            '''
            # boddy_classifier 
            bodies = face_classifier.detectMultiScale(image_gray, 1.1, 3)
            if len(bodies) > 0:
                for (x,y,w,h) in bodies:
                    cv.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 255), 2)
                cv.imwrite( imgDirectory+slash+"lockdown"+slash+"frame%f.jpg" % count, frame)
                print("Quebra de lockdown detectada: frame salvo")
            '''
        #print(fps._numFrames)
        count += 1
        # show the output frame
        cv.imshow("Frame", frame)
        key = cv.waitKey(1) & 0xFF
        # se a tecla q for pressionada, quebra o loop
        if key == ord("q"):
            break
        fps.update()

    fps.stop()
    print("[INFO] elapsed time: {:.2f}".format(fps.elapsed()))
    print("[INFO] approx. FPS: {:.2f}".format(fps.fps()))
            
def extractImagesByFps(mqtt, type=1, taxadeQuadros = 27, pularFrames = 1, imgDirectory = 'frames'):
    face_classifier = openClassifier()
    count = 0
    success = True
    inicioP = timeit.default_timer()
    inicio = inicioP

    if type == 1:
        video = useVideoCapture(imgDirectory)
    else: 
        video = useVideoStream(imgDirectory)
    fps = FPS().start()

    while success:
        if type == 1:
            video.set(cv.CAP_PROP_POS_FRAMES, count)
            success,frame = video.read()
            if not success:
                print("Falha ao abrir o video")
                continue
        else : 
            frame = video.read()
            frame = imutils.resize(frame, width=400)

        if count % (taxadeQuadros*60) == 0:
            print(str(count) + ' frames lidos.')
            fim = timeit.default_timer()
            print('duracao: %f' % (fim - inicioP))
        
        decorrido = timeit.default_timer()
        message = imageToPublishableObj(frame)
        mqtt.publisher(CONFIG['topics']['aovivo'], message, CONFIG['mqtt']['qos'] )
        if( decorrido - inicio > 3):
            image_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
            faces = face_classifier.detectMultiScale(image_gray, 1.3, 5)
            if len(faces) > 0:
                for(x,y,w,h) in faces:
                    cv.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
                # cv.imwrite( imgDirectory+slash+"lockdown"+slash+"frame%f.jpg" % count, frame)
                message = imageToPublishableObj(frame)
                mqtt.publisher(CONFIG['topics']['lockdown'], message, CONFIG['mqtt']['qos'] )
                print("Quebra de lockdown detectada publicada no topico: ", CONFIG['topics']['lockdown'] )
            inicio = timeit.default_timer()
        count = fps._numFrames + pularFrames

        key = cv.waitKey(1) & 0xFF
        # se a tecla q for pressionada, quebra o loop
        if key == ord("q"):
            break
        fps.update()
    fps.stop()
