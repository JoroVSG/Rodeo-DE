const { ipcMain } = require('electron');
const dgram = require('dgram');

const PORT = 15000;
const client = dgram.createSocket('udp6');
client.on('error', err => console.log(err));

client.bind(PORT);

const listen = () => {
    let parsedIp = null;
    client.on('message', async (message, info) => {
        parsedIp = info.address.replace('::ffff:', '');
        console.log(parsedIp);
    });

    ipcMain.handle('gallagherUrl', () => parsedIp);
}

module.exports = {
    listen
}