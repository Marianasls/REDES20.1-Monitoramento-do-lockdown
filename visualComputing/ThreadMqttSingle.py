# coding=utf-8
from mqtt import Mqtt
from threading import Thread
from imutils import opencv2matplotlib
from PIL import Image
import timeit
import datetime
import time
import io
import detectLockdown as dl

class ThreadMqtt(Thread):
    
    def __init__(self, mqtt, CONFIG):
        Thread.__init__(self)
        self.mqtt = mqtt
        self.CONFIG = CONFIG
        self.enviar = False
        self.loop = True

    def run(self):
        # print('nada')
        while(self.loop):
            if self.enviar:
                message = self.imageToPublishableObj(self.frame)
                self.mqtt.publisher(self.CONFIG['topics']['aovivo'], message, self.CONFIG['mqtt']['qos'] )
                self.enviar = False
            
    def imageToPublishableObj(self, frame):
        # return frame.tolist()
        np_array_RGB = opencv2matplotlib(frame)
        image = Image.fromarray(np_array_RGB)
        # return pil_image_to_byte_array(image)
        byte_array = self.pil_image_to_byte_array(image)
        return {'date': self.get_now_string(), 'data': str(byte_array) }
    
    def pil_image_to_byte_array(self, image):
        imgByteArr = io.BytesIO()
        image.save(imgByteArr, "PNG")
        return imgByteArr.getvalue()

    def get_now_string(self):
        return datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S.%f")
    
    def receiveFrame(self, frame, count):
        self.frame = frame
        self.enviar = True
        
    def stop(self):
        self.loop = False