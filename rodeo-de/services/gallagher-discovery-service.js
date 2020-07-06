const { ipcMain } = require('electron');
const dgram = require('dgram');


let parsedIp = null;

const listen = () => {
    const PORT = 15000;
    const client = dgram.createSocket('udp6');
    client.bind(PORT);
    client.on('error', err => console.log(err));
    client.on('message', async (message, info) => {
        parsedIp = info.address.replace('::ffff:', '');
    });

    ipcMain.handle('gallagherUrl', () => parsedIp);
}

module.exports = {
    listen,
    getIp: _ => parsedIp
}