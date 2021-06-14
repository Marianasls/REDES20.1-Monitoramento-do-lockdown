import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Button from '@material-ui/core/Button';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function SimpleDialog(props) {
  const { onClose, selectedValue, open, imagem } = props;
  const [teste, setTeste] = React.useState([]);
  useEffect(() => {
    setTeste(props);
    const testando = document.getElementById('imageDialog');
    console.log(testando);
    testando.src = imagem;
  }, [teste, props, imagem]);
  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <div style={{ height: '168px', width: '300px'}}>
          <img id='imageDialog' ng-src={imagem} alt="teste" width='100%' height='100%' />
        </div>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};
function Row(props) {
  const [open, setOpen] = React.useState(false);
  const [row, setRow] = React.useState('');
  const [openImage, setOpenImage] = React.useState(false);
  const classes = useRowStyles();

  useEffect(() => {
    console.log(props);
    setRow(props);
  }, [row, props]);
  const handleClickOpen = () => {
    setOpenImage(true);
  };

  const handleClose = (value) => {
    setOpenImage(false);
  };
  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {props.row.topic}
        </TableCell>
        <TableCell align="right">{props.row.data}</TableCell>
        <TableCell align="right">{props.row.hora}</TableCell>
        <TableCell align="right">{props.row.hora}</TableCell>

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div style={{ display: 'flex', flex: 1, width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ paddingBottom: 10 }}>
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                  Visualizar Imagem
                </Button>
                <SimpleDialog open={openImage} imagem={props.row.image} onClose={handleClose} />

              </div>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}



const Tabela = (props) => {
  const [tabelinha, setTabela] = React.useState('');

  useEffect(() => {
    setTabela(props);
  }, [props, tabelinha]);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Câmera</TableCell>
            <TableCell align="right">Horário</TableCell>
            <TableCell align="right">Data</TableCell>
            <TableCell align="right">Id</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, index) => (
            <Row key={index} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Tabela;
