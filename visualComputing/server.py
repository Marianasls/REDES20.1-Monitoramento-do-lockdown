import json
import sys
import os
import argparse
import timeit
from datetime import date
from mqtt.Mqtt import Mqtt

mqtt = Mqtt("node02.myqtthub.com", 1883, "server", "server", "server")
mqtt.subscribe("/monitoramento/aovivo")
mqtt.subscribe("/monitoramento/lockdown")

while(True):
    a = 0