import paho.mqtt.client as mqttPaho
import time
import logging
import json
logging.basicConfig(level=logging.INFO)

class Mqtt:
    
    def __init__(self, host, port, ID, user, passwd, topic = "/"):
        self.host = host
        self.port = port
        self.ID = ID
        self.user = user
        self.passwd = passwd
        self.client = mqttPaho.Client(ID, True)
        self.client.username_pw_set(user, passwd)
        self.topic = topic
        self.receiveMsg = False
        self.client.on_log = self.on_log
        self.client.on_connect = self.on_connect
        self.client.on_disconnect = self.on_disconnect
        self.client.on_publish = self.on_publish  
        self.client.on_message = self.on_message    
        mqttPaho.Client.connected_flag=False
        self.client.connect(self.host, self.port)
        self.client.loop_start()

    def publisher(self, path= None, message={}, qos=0, rt=False):
        if path != None:
            self.topic = path

        while not self.client.connected_flag:
            time.sleep(1)

        # Send data 
        message = json.dumps(message)
        ret = self.client.publish(self.topic, message, qos, retain=rt)   #using qoS-0 
        logging.info("published return="+str(ret))
        
        # self.client.loop_stop()
        # self.client.disconnect()
        
    def subscriber(self, path=None):
        if path != None:
            self.topic = path
        # self.client.connect(self.host, self.port)
        # self.client.loop_start()
        self.client.subscribe(self.topic, 0) #qoS-0

    # create functions for callback
    def on_log(self, client, userdata, level, buf):
        logging.info(buf)

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            client.connected_flag=True
        else:
            logging.info("bad connection returned code="+str(rc))
            client.loop_stop()

    def on_disconnect(self, client, userdata, rc):
        logging.info("client disconnected")

    def on_publish(self, client,userdata,mid):            
        logging.info("data published \n")
   
    # The callback for when a PUBLISH message is received from the server.
    def on_message(self, client, userdata, msg):
        msg.payload = msg.payload.decode("utf-8")
        logging.info("topico:" + msg.topic)
        logging.info("mensagem:" + msg.payload)
        msg.payload = json.loads(msg.payload)
        self.msg = msg
        if msg.topic == self.topic:
            self.receiveMsg = True
            logging.info("mensagem: recebida")
        
    def reset(self):
        ret = self.client.publish(self.topic, "", 0, True)
        
    def setTopic(self, topic):
        self.topic = topic
    # realizar um subscribe no mesmo topico que enviou informações e espera uma resposta
    # já devolve o payload da mensagem
    def requestRecv(self, stop=True):
        # sub = self.getSUB()
        self.subscribe()
        return self.requestRecvSub(stop).payload
    
    def requestRecvSub(self, stop=True):
        print('valor do stop ' + str(stop))
        while not self.receiveMsg:
            time.sleep(0.5)
        self.receiveMsg = False
        if stop :
            self.client.disconnect()
            self.client.loop_stop()
        return self.msg
# para teste
