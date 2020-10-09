const { ipcMain } = require('electron');
const dgram = require('dgram');


let devices = [];

const DEVICES_TYPE = {
    TW3: "TW3",
    HR4: "HR4"
}

const listen = () => {
    const PORT = 15000;
    const client = dgram.createSocket('udp6');
    client.bind(PORT);
    client.on('error', err => console.log(err));
    client.on('message', async (message, info) => {
        const deviceName = message.toString();
        if (!devices.find(device => device.name === deviceName)) {
            devices.push({
                name: deviceName,
                ipAddress: info.address.replace('::ffff:', ''),
                type: deviceName.includes(DEVICES_TYPE.TW3) ? DEVICES_TYPE.TW3 : DEVICES_TYPE.HR4
            });
        }
    });
}

module.exports = {
    listen,
    getDevices: _ => devices
}