import json
import sys
import os
import argparse
import timeit
from datetime import date
from mqtt.Mqtt import Mqtt
import detectLockdown as dl

# Para definir se a detecção utiliza arquivo de vídeo ou a câmera 
a = argparse.ArgumentParser()
a.add_argument("-t", "--type", help="1 para detecção por video e 2 para detecção por camera", default=1)
args = a.parse_args()

# Arquivo de configurações com informações do servidor broker MQTT
configFile=os.path.dirname(os.path.realpath(__file__))+"/config/config.json"
CONFIG = json.loads(open(configFile, 'r').read())

def main():
    mqtt = Mqtt(CONFIG['mqtt']['host'], CONFIG['mqtt']['port'], CONFIG['mqtt']['device_id'], CONFIG['mqtt']['device_username'], CONFIG['mqtt']['device_password'])
    
    # se increve para receber o horário que será enviado do cliente para período de lockdown
    # receive_time(mqtt) necessario rodar em um thread separada

    # inicia sensor da câmera e publica frames nos tópicos definidos em CONFIG
    inicio = timeit.default_timer()
    dl.extractImages(mqtt, args.type)
    # extractImagesByFps(mqtt, args.type, 30)
    fim = timeit.default_timer()
    print ('duracao: %f' % (fim - inicio))
    sys.exit()

# Recebe o horário de lockdown e escreve no arquivo de configurações
def receive_time(mqtt):
    mqtt.subscriber(CONFIG['topics']['hora'])
    time = mqtt.requestRecv()
    CONFIG.append(time)
    open(configFile, 'w').write(json.dumps(CONFIG))

# chamada da função principal
if __name__ == "__main__":
    main()