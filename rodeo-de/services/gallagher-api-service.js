const { ipcMain } = require('electron');
const axios = require("axios");
const parser = require('fast-xml-parser');
const he = require('he');
const gallagherService = require('./gallagher-discovery-service');
const gallagherDevicesService = require('./gallagher-discovery-devices');


const options = {
    attributeNamePrefix : "@_",
    attrNodeName: "attr",
    textNodeName : "#text",
    ignoreAttributes : true,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    trimValues: true,
    cdataTagName: "__cdata",
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false, 
    attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),
    tagValueProcessor : (val, tagName) => he.decode(val),
    stopNodes: ["parse-me-as-string"]
};

module.exports = {
    init: () => {
        ipcMain.handle('loadSessions', async _ => {
            const url = gallagherService.getIp();
            const res = await axios(`http://${url}:15001/sessions`);
            if(parser.validate(res.data) === true) {
                const jsonObj = parser.parse(res.data, options);
                return jsonObj;
            }
            return res.data;
        });

        ipcMain.handle('loadSessionById', async (_, sessionId) => {
            const url = gallagherService.getIp();
            const res = await axios(`http://${url}:15001/sessions/${sessionId}`);
            if(parser.validate(res.data) === true) {
                const jsonObj = parser.parse(res.data, options);
                return jsonObj;
            }
            return res.data;
        });

        ipcMain.handle('loadDevices', async _ => gallagherDevicesService.getDevices());
    }
}