# coding=utf-8
from mqtt import Mqtt
from threading import Thread
from imutils import opencv2matplotlib
from PIL import Image
import timeit
import datetime
import time
import io
# import saveImage as saveImg

class ThreadMqtt(Thread):
    
    def __init__(self, frame, mqtt, CONFIG, count=0, lockdown = False):
        Thread.__init__(self)
        self.frame = frame
        self.mqtt = mqtt
        self.CONFIG = CONFIG
        self.count = count
        self.lockdown = lockdown

    def run(self):
        message = self.imageToPublishableObj(self.frame)
        if(self.lockdown):
            self.mqtt.publisher(self.CONFIG['topics']['lockdown'], message, self.CONFIG['mqtt']['qos'] )
        else:
            self.mqtt.publisher(self.CONFIG['topics']['aovivo'], message, self.CONFIG['mqtt']['qos'] )
            
          
    def imageToPublishableObj(self, frame):
        # return frame.tolist()
        np_array_RGB = opencv2matplotlib(frame)
        image = Image.fromarray(np_array_RGB)
        return self.pil_image_to_byte_array(image)
        byte_array = self.pil_image_to_byte_array(image)
        return {'date': self.get_date_string(), 'data': str(byte_array), 'time': self.get_time_string() }
    
    def pil_image_to_byte_array(self, image):
        imgByteArr = io.BytesIO()
        image.save(imgByteArr, "PNG")
        return imgByteArr.getvalue()

    def get_now_string(self):
        return datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S.%f")
    
    def get_date_string(self):
        return datetime.datetime.now().strftime("%Y-%m-%d")
    
    def get_time_string(self):
        return datetime.datetime.now().strftime("%H:%M:%S.%f")
    