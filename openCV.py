import numpy as np
import cv2 as cv

path = cv.data.haarcascades + 'haarcascade_frontalface_default.xml' 
face_classifier = cv.CascadeClassifier(path)
# teste = face_classifier.load(path)

image = cv.imread('img/image2.jpg')
image_gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
faces = face_classifier.detectMultiScale(image_gray, 1.3, 5)

for(x,y,w,h) in faces:
    cv.rectangle(image,(x,y),(x+w,y+h),(255,0,0),2)

cv.imshow('imagem', image)
cv.waitKey(0)
cv.destroyAllWindows()

