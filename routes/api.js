const express = require('express')
const df = require('../functions')
const fs = require("fs");
const Papa = require('papaparse');
const router = express.Router()

router.get('/data/:month/:year', async (req, res) => {
    const month = req.params.month
    const year = req.params.year
    await df.scrapedata(month, year)
    let data = await df.compileData(month, year)
    res.send(data)
})

router.get('/stats/:month/:year', async (req, res) => {
    const month = req.params.month
    const year = req.params.year
    let data = await df.getDistrictStats(month, year)
    res.send(data)
})

//Returns the requested report
router.get('/fetch/report', async function (req, res){
    const fs = require("fs");
    let report = req.query.report
    let year = req.query.year
    let month = req.query.month
    let data = []

    const file = 'public/files/' + report;
    let csvData = []

    if (!fs.existsSync(file)) {
        await df.scrapedata(month, year)
    }

    if (fs.existsSync(file)) {
        csvData = fs.readFileSync(file, 'utf8');
        let arr = []
        let jsonData = []

        jsonData = Papa.parse(csvData, { header: false, dynamicTyping: true });
        for(let i= 0; i < jsonData['data'].length; i++){
            if(jsonData['data'][i][0] !== null){
                arr.push(jsonData['data'][i])
            }
        }
        res.send({data:arr})

    } else {
        res.status(404)
        res.send('Does not Exist')
    }
})

//Downloads the requested report
router.get('/download', function (req, res) {
    let report = req.query.report
    res.download('public/files/' + report);
})

module.exports = router;
