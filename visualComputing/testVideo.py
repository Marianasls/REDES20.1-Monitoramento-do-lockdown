import sys
import os
import argparse
from datetime import date

import cv2
print(cv2.__version__)

import systemType as s_type
slash=s_type.type_slash()

def extractImages(video, imgDirectory = 'frames'):
    count = 0
    fps = 27
    # imgDirectory = imgDirectory + slash + date.today()
    imgDirectory = imgDirectory + slash + video.replace('video'+slash,'').replace('.mp4','')
    os.makedirs(imgDirectory, exist_ok=True)
    vidcap = cv2.VideoCapture(video)
    success = True
    while success:
        vidcap.set(cv2.CAP_PROP_POS_MSEC,( count *1000)) 
        success,image = vidcap.read()
        print ('Read a new frame: ', success)
        if success:
            cv2.imwrite( imgDirectory + slash+"frame%f.jpg" % count, image)     # save frame as JPEG file
            count = count + 1/fps

a = argparse.ArgumentParser()
args = a.parse_args()
print(args)
extractImages('video'+slash+'Festival-cultura-japonesa-SP.mp4')