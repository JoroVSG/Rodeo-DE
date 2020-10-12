const { ipcMain } = require('electron');
const dgram = require('dgram');


let devices = [];
let client = null;

const DEVICES_TYPE = {
    TW3: "TW3",
    HR4: "HR4"
}

const PING = "p";

const listen = () => {
    const PORT = 15000;
    client = dgram.createSocket('udp6');
    client.bind(PORT);
    client.on('error', err => console.log(err));
    client.on('message', async (message, info) => {
        devices = [];
        const deviceName = message.toString();
        if (!devices.find(device => device.name === deviceName) && deviceName?.toLocaleLowerCase() !== PING) {
            devices.push({
                name: deviceName,
                ipAddress: info.address.replace('::ffff:', ''),
                type: deviceName.includes(DEVICES_TYPE.TW3) ? DEVICES_TYPE.TW3 : DEVICES_TYPE.HR4
            });
        }
        
        // if (deviceName?.toLocaleLowerCase() === PING) {
        //     // const client1 = dgram.createSocket('udp6');
        //     // client?.send(Buffer.from("p"), 15000, "255.255.255.255");
        //     const buffer = Buffer.from('P');
        //     client.send(buffer, PORT, undefined, (err) => {
        //         if(err) {
        //             throw err
        //         }
        //         //client.close();
        //     });
        // }
        console.log(deviceName)
        
    });
}

module.exports = {
    listen,
    getDevices: _ => devices,
    client
}