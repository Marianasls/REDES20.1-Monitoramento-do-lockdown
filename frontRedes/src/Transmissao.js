import React, { useState, useEffect } from 'react';
import Tabela from './Tabela';
import api from './api';
const Transmissao = () => {
    const [image,setImage] = useState('');
    useEffect(() => {
        const teste = async () => {
            const response = await api.get('/');
            setImage(image);
            console.log(response);
        }   
        teste();
    });
    return (
        <div style={{ display: 'flex', flex: 1, width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>
            <div style={{ display: 'flex', flex: 1, width: '80%', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 50 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, margin: 0, paddingBottom: 10, color: 'white' }}>CÂMERA 1</p>
                    <div style={{ height: '250px', width: '250px', backgroundColor: 'white' }}>
                        <img src={'http://localhost:4000/public/example.jpg'} alt='test' />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, margin: 0, paddingBottom: 10, color: 'white' }}>CÂMERA 2</p>
                    <div style={{ height: '250px', width: '250px', backgroundColor: 'white' }}>
                        <p>Oi</p>

                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, margin: 0, paddingBottom: 10, color: 'white' }}>CÂMERA 3</p>
                    <div style={{ height: '250px', width: '250px', backgroundColor: 'white' }}>
                        <p>Oi</p>
                    </div>
                </div>
            </div>
            <p style={{ textAlign: 'center', fontSize: 20, fontWeight: 700, margin: 0, paddingTop: 50, color: 'white' }}>Log da detecção</p>
            <div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '80%', paddingTop: 30, marginBottom: 20 }}>
                <Tabela />
            </div>
        </div>
    )

}

export default Transmissao;