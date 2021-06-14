import React, { useState, useEffect } from 'react';
import Tabela from './Tabela';
import api from './api';
import socketIOClient from "socket.io-client";
const ENDPOINT = "localhost:8080";
const Transmissao = () => {
    const [imagemTransmissao, setImage] = useState('');
    const [imagemTransmissao2, setImage2] = useState('');
    const [imagemTransmissao3, setImage3] = useState('');
    const [deteccao, setDeteccao] = useState(['']);

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on('dataInfo', (dataInfo) => {
            console.log('to aqui');
            const detect = document.getElementById('imagem');
            const detect2 = document.getElementById('imagem2');
            const detect3 = document.getElementById('imagem3');
            console.log(dataInfo.topic);
            if(dataInfo.topic === 'monitoramento/aovivo/1'){
                detect.src = `data:image/jpg;base64,${dataInfo.image}`;
                let urlImage = `data:image/jpg;base64,${dataInfo.image}`;
                setImage(urlImage);

            }else if(dataInfo.topic === 'monitoramento/aovivo/2'){
                detect2.src = `data:image/jpg;base64,${dataInfo.image}`;
                let urlImage = `data:image/jpg;base64,${dataInfo.image}`;
                setImage2(urlImage);

            }else if(dataInfo.topic === 'monitoramento/aovivo/3'){
                detect3.src = `data:image/jpg;base64,${dataInfo.image}`;
                let urlImage = `data:image/jpg;base64,${dataInfo.image}`;
                setImage3(urlImage);

            } else {
                let urlImage = `data:image/jpg;base64,${dataInfo.image}`;
                var arrayAux = [];
                arrayAux = deteccao;
                let dadosTemp = {
                    topic: dataInfo.topic,
                    image: urlImage,
                    hora: dataInfo.hora,
                    data: dataInfo.data,
                }
                arrayAux.push(dadosTemp);
                console.log(arrayAux);
                setDeteccao(arrayAux);
            }
            console.log('estou aqui');
            console.log(dataInfo.image);
        });
    }, [imagemTransmissao, imagemTransmissao2, imagemTransmissao3, deteccao]);
    return (
        <div style={{ display: 'flex', flex: 1, width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>
            <div style={{ display: 'flex', flex: 1, width: '80%', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 50 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, margin: 0, paddingBottom: 10, color: 'white' }}>CÂMERA 1</p>
                    <div style={{ height: '168px', width: '300px', backgroundColor: 'white' }}>
                        <img id='imagem' ng-src={imagemTransmissao} alt="teste" width='100%' height='100%' />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, margin: 0, paddingBottom: 10, color: 'white' }}>CÂMERA 2</p>
                    <div style={{ height: '168px', width: '300px', backgroundColor: 'white' }}>
                        <img id='imagem2' ng-src={imagemTransmissao2} alt="teste" width='100%' height='100%' />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, margin: 0, paddingBottom: 10, color: 'white' }}>CÂMERA 3</p>
                    <div style={{ height: '168px', width: '300px', backgroundColor: 'white' }}>
                        <img id='imagem3' ng-src={imagemTransmissao3} alt="teste" width='100%' height='100%' />
                    </div>
                </div>
            </div>
            <p style={{ textAlign: 'center', fontSize: 20, fontWeight: 700, margin: 0, paddingTop: 50, color: 'white' }}>Log da detecção</p>
            <div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '80%', paddingTop: 30, marginBottom: 20 }}>
                <Tabela rows={deteccao} />
            </div>
        </div>
    )

}

export default Transmissao;