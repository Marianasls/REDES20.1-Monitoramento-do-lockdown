import React, { useState, useEffect } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import api from './api';
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



const Horario = ({location, history}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [horarioInicio, setHorarioInicio] = useState('7:30:00');
    const [horarioFinal, setHorarioFinal] = useState('9:30:00');
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = async () => {
        setOpen(true);
        var init = horarioInicio;
        var finish = horarioFinal;
        var data =  {
            init,
            finish
        }
        const response = await api.post('/horario', {
            headers: {
                'Content-Type': 'application/json'
            },
            data
        })
        console.log(response);
        setTimeout( 
            () => {
                history.push({
                    pathname: '/transmissao'
                })
            },
            5000
        )

    };

    return (
        <div style={{ display: 'flex', flex: 1, height: '100vh', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <p style={{ paddingTop: 50, color: 'white', fontWeight: '700', fontSize: 22 }}>Seja bem vindo ao Sistema de monitoramento de quebra de LockDown !</p>
                <p style={{ color: 'white', fontWeight: '700', fontSize: 18, paddingTop: 20}}>Informe o horário inicial e final do Lockdown:</p>

            </div>
            <div style={{display: 'flex', width: '30%', flexDirection: 'row', justifyContent: 'space-around'}}>
                <form noValidate>
                    <TextField
                        id="time"
                        label="Início"
                        type="time"
                        defaultValue="07:30"
                        onChange={(event) => {
                            setHorarioInicio(event.target.value+':'+'00');
                          }}
                        InputLabelProps={{
                            shrink: true,
                            color: 'secondary'
                        }}
                        inputProps={{
                            step: 300, // 5 min
                            color: 'white'
                        }}
                        sx={{ width: 200 }}
                    />
                </form>
                <form noValidate>
                    <TextField
                        id="time"
                        label="Fim"
                        type="time"
                        defaultValue="09:30"
                        onChange={(event) => {
                            setHorarioFinal(event.target.value+':'+'00');
                          }}
                        InputLabelProps={{
                            shrink: true,
                            color: 'secondary'
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                        sx={{ width: 200 }}
                    />
                </form>
            </div>
            <div style={{ paddingTop: 20 }}>
                <CssButton variant="outlined" color="default" onClick={handleToggle}>
                    Enviar Horário
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

export default Horario;
