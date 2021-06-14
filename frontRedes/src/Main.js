import React, { useState, useEffect } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import api from './api';
import socketIOClient from "socket.io-client";
const ENDPOINT = "localhost:8080";
const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));
const CssTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: 'white',
        },
        borderColor: 'white',

    },
})(TextField);
const CssButton = withStyles({
    root: {

        borderColor: 'white',
        '& .MuiButton-label': {
            color: 'white'
        }
    },
})(Button);



const Main = ({ location, history }) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [responseIO, setResponse] = useState("");

    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = async () => {
        setOpen(true);
        const response = await api.post('/conexao');
        setResponse(response);
        console.log(response);
        setTimeout(
            () => {
                history.push({
                    pathname: '/horario'
                })
            },
            5000
        )

    };

    return (
        <div style={{ display: 'flex', flex: 1, height: '100vh', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <p style={{ paddingTop: 50, color: 'white', fontWeight: '700', fontSize: 22 }}>Seja bem vindo ao Sistema de monitoramento de quebra de LockDown !</p>
                <p style={{ color: 'white', fontWeight: '700', fontSize: 18 }}>Para iniciar a conexão, insira as informações do Broker MQTT:</p>

            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ paddingTop: 10 }}>

                    <CssTextField
                        required
                        color="white"
                        id="filled-required"
                        label="Host"
                        defaultValue="45.167.218.51"
                        variant="filled"
                    />
                </div>
                <div style={{ paddingTop: 10 }}>

                    <CssTextField
                        required
                        color="white"
                        id="filled-required"
                        label="Porta"
                        defaultValue="8684"
                        variant="filled"
                    />
                </div>


                <div style={{ paddingTop: 10 }}>
                    <CssTextField
                        required
                        color="white"
                        id="filled-required"
                        label="Usuário"
                        defaultValue="elviserafim"
                        variant="filled"
                    />
                </div>

                <div style={{ paddingTop: 10 }}>
                    <CssTextField
                        required
                        color="white"
                        id="filled-required"
                        label="Senha"
                        defaultValue="elvis123"
                        variant="filled"
                    />
                </div>

            </div>
            <div style={{ paddingTop: 10 }}>
                <CssButton variant="outlined" color="default" onClick={handleToggle}>
                    Iniciar Conexão
                </CssButton>
            </div>
            <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
                <Fade
                    in={open}
                    style={{
                        transitionDelay: true ? '800ms' : '0ms',
                    }}
                    unmountOnExit
                >
                    <CircularProgress color="primary" />
                </Fade>
            </Backdrop>
        </div>
    );
}

export default Main;
