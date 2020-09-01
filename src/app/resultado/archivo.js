const fs = require('fs');

const archivo = 'valores.txt';

fs.writeFile(archivo, result, (err) => {
    if (err) throw ('hubo un problema');

    console.log('archivo escrito');
});