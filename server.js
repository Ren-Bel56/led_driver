const express = require('express');
const SerialPort = require('serialport');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Remplace '/dev/ttyUSB0' par le port série de ton Arduino (ex: '/dev/tty.usbserial-2410' ou '/dev/ttyUSB0')
const arduino = new SerialPort.SerialPort({
    path: '/dev/tty.usbserial-2410',
    baudRate: 9600
});

app.use(bodyParser.json());
app.use(express.static(__dirname)); // Sert Led_Manager.html et les fichiers statiques

app.post('/envoyer', (req, res) => {
    const pwm = req.body.pwm;
    if (typeof pwm === 'undefined') {
        return res.status(400).send('Valeur PWM manquante');
    }
    arduino.write(pwm + '\n', (err) => {
        if (err) {
            return res.status(500).send('Erreur série');
        }
        res.send(pwm.toString());
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});