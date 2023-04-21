const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs')
const ObjectsToCsv = require("objects-to-csv");
const { parse } = require("csv-parse");

async function getData(month, year){
    await scrapedata(month, year)
    let data = await compileData(month, year)
    //console.log(data)
    return data
}

async function scrapedata(month, year){
    let currentYear = new Date().getFullYear()
    if ((parseInt(year) >= 2008 && parseInt(year) <= currentYear)) {
        await getDistrictPerformance(month,year)
        await getClubPerformance(month, year)
        await getDivisionPerformance(month, year)
        if(parseInt(year) === currentYear){
            await getClubCoaches(month, year)
            await getMemberAchievements(month, year)
            await getOfficersList(month, year)
        }
    }
}

async function getClubCoaches(month, year){
    try {
        let html = await axios.get('http://reports.toastmasters.org/reports/dprReports.cfm?r=6&d=40')
        let $ = await cheerio.load(html.data)
        let rows = []
        const sel = "tbody tbody tbody:nth-child(1) tr";
        $(sel).each(function (i, e) {
            const row = [];
            rows.push(row);
            $(this).find("th, td").each(function (i, e) {
                row.push($(this).text().trim());
            });
        });
        for(let i = 1; i < rows.length; i++){
            if(rows[i][3].indexOf(',') === -1){

            } else {
                rows[i][3] = rows[i][3].substring(0, rows[i][3].indexOf(','))
            }
        }
        let data = []
        for(let i = 1; i < rows.length;i++){
            let obj = {}
            Object.assign(obj, {Club: rows[i]['0'].toString().padStart(8, "0")})
            Object.assign(obj, {'Club Name': rows[i]['1']})
            Object.assign(obj, {Code: rows[i]['2']})
            Object.assign(obj, {Name: rows[i]['3']})
            Object.assign(obj, {'Begin Date': rows[i]['4']})
            Object.assign(obj, {Status: rows[i]['5']})
            data.push(obj)
        }
        const csv = new ObjectsToCsv(data);
        let filename = 'public/files/club_coaches/club_coaches-' + month + '_' + year + '.csv'
        await csv.toDisk(filename, {append: false})
        return filename
    } catch (error) {
        console.error(error)
    }
}

async function getClubPerformance(month, year){
    try {
        let prevyear = (parseInt(year)-1).toString()
        const html = await axios.get('http://dashboards.toastmasters.org/' + prevyear + '-' + year + '/club.aspx?id=40&hideclub=1&month='+ month)
        let $ = await cheerio.load(html.data)
        let dll = $('#cpContent_TopControls1_ddlExport').attr('onchange').split(',')
        let val = (dll[1].toString()).substring(1, dll[1].length-1)
        const html2 = await axios.get('http://dashboards.toastmasters.org/' + prevyear + '-' + year + '/export.aspx?type=CSV&report=' + val)
        $ = await cheerio.load(html2.data)
        let body = $('body').contents().text()
        body = body.substring(0,body.lastIndexOf('\n'))
        body = body.substring(0,body.lastIndexOf('\n'))
        let filename = 'public/files/club_performance/club_performance-' + month + '_' + year + '.csv'
        try{
            fs.writeFile(filename, body, (err) => {
            })
        } catch (error) {
            console.error(error)
        }
        return filename
    } catch (error) {
        console.error(error)
        return
    }
}

async function getDistrictPerformance(month, year){
    try {
        let prevyear = (parseInt(year)-1).toString()
        const html = await axios.get('http://dashboards.toastmasters.org/' + prevyear + '-' + year + '/district.aspx?id=40&hideclub=1&month='+ month)
        let $ = await cheerio.load(html.data)
        let dll = $('#cpContent_TopControls1_ddlExport').attr('onchange').split(',')
        let val = (dll[1].toString()).substring(1, dll[1].length-1)
        const html2 = await axios.get('http://dashboards.toastmasters.org/' + prevyear + '-' + year + '/export.aspx?type=CSV&report=' + val)
        $ = await cheerio.load(html2.data)
        let body = $('body').contents().text()
        body = body.substring(0,body.lastIndexOf('\n'))
        body = body.substring(0,body.lastIndexOf('\n'))
        let filename = 'public/files/district_performance/district_performance-' + month + '_' + year + '.csv'
        try{
            fs.writeFile(filename, body, (err) => {
            })
        } catch (error) {
            console.error(error)
        }
        return filename
    } catch (error) {
        console.error(error)
        return
    }
}

async function getDivisionPerformance(month, year){
    try {
        let prevyear = (parseInt(year)-1).toString()
        const html = await axios.get('http://dashboards.toastmasters.org/' + prevyear + '-' + year + '/division.aspx?id=40&hideclub=1&month='+ month)
        let $ = await cheerio.load(html.data)
        let dll = $('#cpContent_TopControls1_ddlExport').attr('onchange').split(',')
        let val = (dll[1].toString()).substring(1, dll[1].length-1)
        const html2 = await axios.get('http://dashboards.toastmasters.org/' + prevyear + '-' + year + '/export.aspx?type=CSV&report=' + val)
        $ = await cheerio.load(html2.data)
        let body = $('body').contents().text()
        body = body.substring(0,body.lastIndexOf('\n'))
        body = body.substring(0,body.lastIndexOf('\n'))
        let filename = 'public/files/division_performance/division_performance-' + month + '_' + year + '.csv'
        try{
            fs.writeFile(filename, body, (err) => {
            })
        } catch (error) {
            console.error(error)
        }
        return filename
    } catch (error) {
        console.error(error)
        return
    }
}

async function getMemberAchievements(month, year){
    try {
        let html = await axios.get('http://reports.toastmasters.org/reports/dprReports.cfm?r=3&d=40')
        let $ = await cheerio.load(html.data)
        let rows = []
        const sel = "tbody tbody tbody:nth-child(1) tr";
        $(sel).each(function (i, e) {
            const row = [];
            rows.push(row);
            $(this).find("th, td, td a").each(function (i, e) {
                row.push($(this).text().trim());
            });
        });
        let data = []
        for(let i = 1; i < rows.length;i++){
            let obj = {}
            Object.assign(obj, {Club: rows[i]['0']})
            Object.assign(obj, {Division: rows[i]['1']})
            Object.assign(obj, {Area: rows[i]['2']})
            Object.assign(obj, {Award: rows[i]['4']})
            Object.assign(obj, {Date: rows[i]['5']})
            Object.assign(obj, {Member: rows[i]['6']})
            Object.assign(obj, {'Club Name': rows[i]['7']})
            Object.assign(obj, {Location: rows[i]['8']})
            data.push(obj)
        }

        for(let i = 0; i < data.length; i++){
            if(data[i]['Member'].indexOf(',') === -1){

            } else {
                data[i]['Member'] = data[i]['Member'].substring(0, data[i]['Member'].indexOf(','))
            }
        }

        const csv = new ObjectsToCsv(data);
        let filename = 'public/files/members_achievements/members_achievements-' + month + '_' + year + '.csv'
        await csv.toDisk(filename, {append: false})
        return filename
    } catch (error) {
        console.error(error)
    }
}

async function getOfficersList(month, year){
    try {
        let today = new Date()
        let start = new Date(year, 1, 1)
        let end = new Date(year, 6, 30)
        let rows = []
        let jan = false
        if(start < today < end){
            jan = true
            let html = await axios.get('http://reports.toastmasters.org/reports/dprReports.cfm?r=2&d=40')
            let $ = await cheerio.load(html.data)
            let sel = "tbody tbody tbody:nth-child(1) tr";
            $(sel).each(function (i, e) {
                const row = [];
                rows.push(row);
                $(this).find("th, td").each(function (i, e) {
                    row.push($(this).text().trim());
                });
            });
        }
        let html = await axios.get('http://reports.toastmasters.org/reports/dprReports.cfm?r=17&d=40')
        let $ = await cheerio.load(html.data)
        const sel = "tbody tbody tbody:nth-child(1) tr";
        $(sel).each(function (i, e) {
            if(jan === true && i === 0){
                return
            }
            const row = [];
            rows.push(row);
            $(this).find("th, td").each(function (i, e) {
                row.push($(this).text().trim());
            });
        });
        let data = []
        for(let i = 1; i < rows.length;i++){
            let obj = {}
            Object.assign(obj, {Club: rows[i]['0'].toString().padStart(8, "0")})
            Object.assign(obj, {Division: rows[i]['1']})
            Object.assign(obj, {Area: rows[i]['2']})
            Object.assign(obj, {'List Status': rows[i]['3']})
            Object.assign(obj, {Election: rows[i]['4']})
            Object.assign(obj, {Name: rows[i]['5']})
            data.push(obj)
        }
        const csv = new ObjectsToCsv(data);
        let filename = 'public/files/officers/officers-' + month + '_' + year + '.csv'
        await csv.toDisk(filename, {append: false})
        return filename
    } catch (error) {
        console.error(error)
        return
    }
}

function getDistrictData(filename){
    const districtdata = [];
    if(fs.existsSync(filename)) {
        return new Promise((resolve, reject) => {
            fs.createReadStream(filename)
                .pipe(
                    parse({
                        delimiter: ",",
                        columns: true,
                        ltrim: true,
                    })
                )
                .on("data", function (row) {
                    // 👇 push the object row into the array
                    districtdata.push(row);
                })
                .on("error", function (error) {
                    console.log(error.message);
                })
                .on("end", function () {
                    // 👇 log the result array
                    resolve(districtdata)
                });
        })
    } else {
        return districtdata
    }

}

function getClubData(filename){
    const clubdata = []
    if(fs.existsSync(filename)) {
        return new Promise((resolve, reject) => {
            fs.createReadStream(filename)
                .pipe(
                    parse({
                        delimiter: ",",
                        columns: true,
                        ltrim: true,
                    })
                )
                .on("data", function (row) {
                    // 👇 push the object row into the array
                    clubdata.push(row);
                })
                .on("error", function (error) {
                    console.log(error.message);
                })
                .on("end", function () {
                    // 👇 log the result array
                    resolve(clubdata)
                });
        })
    } else {
        return clubdata
    }
}

function getDivisionData(filename){
    const divisiondata = []
    if(fs.existsSync(filename)) {
        return new Promise((resolve, reject) => {
            fs.createReadStream(filename)
                .pipe(
                    parse({
                        delimiter: ",",
                        columns: true,
                        ltrim: true,
                    })
                )
                .on("data", function (row) {
                    // 👇 push the object row into the array
                    divisiondata.push(row);
                })
                .on("error", function (error) {
                    console.log(error.message);
                })
                .on("end", function () {
                    // 👇 log the result array
                    resolve(divisiondata)
                });
        })
    } else {
        return divisiondata
    }
}

function getCoachData(filename){
    const coachdata = []
    if(fs.existsSync(filename)){
        return new Promise((resolve, reject) => {
            fs.createReadStream(filename)
                .pipe(
                    parse({
                        delimiter: ",",
                        columns: true,
                        ltrim: true,
                    })
                )
                .on("data", function (row) {
                    // 👇 push the object row into the array
                    coachdata.push(row);
                })
                .on("error", function (error) {
                    console.log(error.message);
                })
                .on("end", function () {
                    // 👇 log the result array
                    resolve(coachdata)
                });
        })
    } else {
        return coachdata
    }
}

function getOfficerData(filename){
    const officerdata = []
    if(fs.existsSync(filename)) {
        return new Promise((resolve, reject) => {
            fs.createReadStream(filename)
                .pipe(
                    parse({
                        delimiter: ",",
                        columns: true,
                        ltrim: true,
                    })
                )
                .on("data", function (row) {
                    // 👇 push the object row into the array
                    officerdata.push(row);
                })
                .on("error", function (error) {
                    console.log(error.message);
                })
                .on("end", function () {
                    // 👇 log the result array
                    resolve(officerdata)
                });
        })
    } else {
        return officerdata
    }

}

function getMembersAchievementsData(filename){
    const membersdata = []
    if(fs.existsSync(filename)) {
        return new Promise((resolve, reject) => {
            fs.createReadStream(filename)
                .pipe(
                    parse({
                        delimiter: ",",
                        columns: true,
                        ltrim: true,
                    })
                )
                .on("data", function (row) {
                    // 👇 push the object row into the array
                    membersdata.push(row);
                })
                .on("error", function (error) {
                    console.log(error.message);
                })
                .on("end", function () {
                    // 👇 log the result array
                    resolve(membersdata)
                });
        })
    } else {
        return membersdata
    }
}

async function compileData(month, year){
    let todayMonth = (new Date().getMonth()+1).toString()
    if (todayMonth.length<2){
        todayMonth = '0'+ todayMonth
    }
    let todayYear = (new Date().getFullYear())
    const districtdata = await getDistrictData('public/files/district_performance/district_performance-' + month + '_' + year + '.csv')
    const divisiondata = await getDivisionData('public/files/division_performance/division_performance-' + month + '_' + year + '.csv')
    const clubdata = await getClubData('public/files/club_performance/club_performance-' + month + '_' + year + '.csv')
    const coachdata = await getCoachData('public/files/club_coaches/club_coaches-' + month + '_' + year + '.csv')
    const officerdata = await getOfficerData('public/files/officers/officers-' + month + '_' + year + '.csv')
    const membersdata = await getMembersAchievementsData('public/files/members_achievements/members_achievements-' + month + '_' + year + '.csv')

    //combine district, division, and club performance
    for (let i = 0; i < districtdata.length; i++) {
        for (let j = 0; j < clubdata.length; j++){
            if (districtdata[i]['Club'] === clubdata[j]['Club Number']) {
                districtdata[i] = {...districtdata[i], ...clubdata[j]}
            }
        } 
    }

    for (let i = 0; i < districtdata.length; i++) {
        for (let j = 0; j < divisiondata.length; j++){
            if (districtdata[i]['Club'] === divisiondata[j]['Club']) {
                districtdata[i] = {...districtdata[i], ...divisiondata[j]}
            }
        }
        delete districtdata[i]['Club Number']
    }

    
    for (let i = 0; i < districtdata.length; i++) {
        //calculate education points
        let eduPoints = 0;
        if(parseInt(districtdata[i]['Level 1s']) >= 4){
            eduPoints++;
        }
        if(parseInt(districtdata[i]['Level 2s']) >= 2){
            eduPoints++;
        }
        if(parseInt(districtdata[i]['Add. Level 2s']) >= 2){
            eduPoints++;
        }
        if(parseInt(districtdata[i]['Level 3s']) >= 2){
            eduPoints++;
        }
        if(parseInt(districtdata[i]['Level 4s, Level 5s, or DTM award']) >= 1){
            eduPoints++;
        }
        if(parseInt(districtdata[i]['Add. Level 4s, Level 5s, or DTM award']) >= 1){
            eduPoints++;
        }
        Object.assign(districtdata[i], {'Education Points': eduPoints})
        //calculate training points
        let tPoints = 0;
        if(parseInt(districtdata[i]['Off. Trained Round 1']) >= 4){
            tPoints = tPoints + .5;
        }
        if(parseInt(districtdata[i]['Off. Trained Round 2']) >= 4){
            tPoints = tPoints + .5;
        }

        Object.assign(districtdata[i], {'Training Points': tPoints})
        //calculate Membership net
        let net = parseInt(districtdata[i]['Active Members']) - parseInt(districtdata[i]['Mem. Base'])
        Object.assign(districtdata[i], {'Net': net})
        //calculate goals status
        if(parseInt(districtdata[i]['Goals Met']) < 1 && (districtdata[i]['Net'] < 3 && districtdata[i]['Active Members'] < 20)){
            Object.assign(districtdata[i], {'Goals Status': "Red"})
        } else if(parseInt(districtdata[i]['Goals Met']) < 5 || (districtdata[i]['Net'] < 3 && districtdata[i]['Active Members'] < 20)){
            Object.assign(districtdata[i], {'Goals Status': "Yellow"})
        } else {
            Object.assign(districtdata[i], {'Goals Status': "Green"})
        }
        //add coach, mentor and officer to data
        Object.assign(districtdata[i], {'Club Coach': []})
        Object.assign(districtdata[i], {'Peer Mentor': []})
        Object.assign(districtdata[i], {'Officer': []})
        Object.assign(districtdata[i], {'Members Achievements': []})
    }
    //add coach, mentor and officer to data
    for(let i = 0; i < officerdata.length; i++){
        for(let j = 0; j < districtdata.length; j++){
            if(officerdata[i]["Club"].toString().padStart(8, "0") === districtdata[j]["Club"]){
                let obj = {}
                Object.assign(obj, {'List Status': officerdata[i]["List Status"]})
                Object.assign(obj, {'Election': officerdata[i]["Election"]})
                Object.assign(obj, {'Name': officerdata[i]["Name"]})
                districtdata[j]['Officer'].push(obj)
            }
        }
    }
    for(let i = 0; i < coachdata.length; i++){
        for(let j = 0; j < districtdata.length; j++){
            if(coachdata[i]["Club"].toString().padStart(8, "0") === districtdata[j]["Club"]){
                if(coachdata[i]['Status'] === 'PENDING') {
                    let obj = {}
                    Object.assign(obj, {'Division': districtdata[j]['Division']})
                    Object.assign(obj, {'Area': districtdata[j]['Area']})
                    Object.assign(obj, {'Club Number': coachdata[i]["Club"]})
                    Object.assign(obj, {'Club Name': coachdata[i]["Club Name"]})
                    Object.assign(obj, {'Code': coachdata[i]["Code"]})
                    Object.assign(obj, {'Name': coachdata[i]["Name"]})
                    Object.assign(obj, {'Begin Date': coachdata[i]["Begin Date"]})
                    Object.assign(obj, {'Status': coachdata[i]["Status"]})
                    districtdata[j]['Club Coach'].push(obj)
                }
            }
        }
    }
    for(let i = 1; i < membersdata.length; i++){
        for(let j = 0; j < districtdata.length; j++){
            if(membersdata[i]["Club"].toString().padStart(8, "0") === districtdata[j]["Club"]){
                //console.log(officerdata[i] + " " + districtdata[j])
                let obj = {}
                Object.assign(obj, {'Member': membersdata[i]["Member"]})
                Object.assign(obj, {'Award': membersdata[i]["Award"]})
                Object.assign(obj, {'Date': membersdata[i]["Date"]})
                if(obj['Award'] === 'PWMENTORPGM'){
                    districtdata[j]['Peer Mentor'].push(obj)
                } else {
                    districtdata[j]['Members Achievements'].push(obj)
                }

            }
        }
    }

    const groupBy = key => array =>
        array.reduce((objectsByKeyValue, obj) => {
            const value = obj[key];
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
            return objectsByKeyValue;
        }, {});

    const groupByMember = groupBy("Member")

    for(let i = 0; i < districtdata.length;i++){
        districtdata[i]['Members Achievements'] = groupByMember(districtdata[i]['Members Achievements'])
    }
    const jsonString = JSON.stringify(districtdata)
    return districtdata

}

async function OcompileData(month, year){
    let todayMonth = (new Date().getMonth()+1).toString()
    if (todayMonth.length<2){
        todayMonth = '0'+ todayMonth
    }
    let todayYear = (new Date().getFullYear())
    const districtdata = await getDistrictData('public/files/district_performance/district_performance-' + month + '_' + year + '.csv')
    const divisiondata = await getDivisionData('public/files/division_performance/division_performance-' + month + '_' + year + '.csv')
    const clubdata = await getClubData('public/files/club_performance/club_performance-' + month + '_' + year + '.csv')
    const coachdata = await getCoachData('public/files/club_coaches/club_coaches-' + month + '_' + year + '.csv')
    const officerdata = await getOfficerData('public/files/officers/officers-' + month + '_' + year + '.csv')
    const membersdata = await getMembersAchievementsData('public/files/members_achievements/members_achievements-' + month + '_' + year + '.csv')

    //combine district, division, and club performance
    try {
        for (let i = 0; i < districtdata.length; i++) {
                if (districtdata[i]['Club'] === clubdata[i]['Club Number']) {
                    districtdata[i] = {...districtdata[i], ...clubdata[i]}
                }
            }
    } catch (error){
        console.error(error)
    }
    
    for (let i = 0; i < districtdata.length; i++) {
        delete districtdata[i]['Club Number']
    }

    for (let i = 0; i < districtdata.length; i++) {
        if (districtdata[i]['Club'] === divisiondata[i]['Club']) {
            districtdata[i] = {...districtdata[i], ...divisiondata[i]}
        }
    }

    //calculate education points
    for (let i = 0; i < districtdata.length; i++) {
        let points = 0;
        if(parseInt(districtdata[i]['Level 1s']) >= 4){
            points++;
        }
        if(parseInt(districtdata[i]['Level 2s']) >= 2){
            points++;
        }
        if(parseInt(districtdata[i]['Add. Level 2s']) >= 2){
            points++;
        }
        if(parseInt(districtdata[i]['Level 3s']) >= 2){
            points++;
        }
        if(parseInt(districtdata[i]['Level 4s, Level 5s, or DTM award']) >= 1){
            points++;
        }
        if(parseInt(districtdata[i]['Add. Level 4s, Level 5s, or DTM award']) >= 1){
            points++;
        }
        Object.assign(districtdata[i], {'Education Points': points})
    }

    //calculate training points
    for (let i = 0; i < districtdata.length; i++) {
        let points = 0;
        if(parseInt(districtdata[i]['Off. Trained Round 1']) >= 4){
            points = points + .5;
        }
        if(parseInt(districtdata[i]['Off. Trained Round 2']) >= 4){
            points = points + .5;
        }

        Object.assign(districtdata[i], {'Training Points': points})
    }

    //calculate Membership net
    for (let i = 0; i < districtdata.length; i++) {
        let net = parseInt(districtdata[i]['Active Members']) - parseInt(districtdata[i]['Mem. Base'])
        Object.assign(districtdata[i], {'Net': net})
    }

    //calculate goals status
    for (let i = 0; i < districtdata.length; i++) {
        if(parseInt(districtdata[i]['Goals Met']) < 1 && (districtdata[i]['Net'] < 3 && districtdata[i]['Active Members'] < 20)){
            Object.assign(districtdata[i], {'Goals Status': "Red"})
        } else if(parseInt(districtdata[i]['Goals Met']) < 5 || (districtdata[i]['Net'] < 3 && districtdata[i]['Active Members'] < 20)){
            Object.assign(districtdata[i], {'Goals Status': "Yellow"})
        } else {
            Object.assign(districtdata[i], {'Goals Status': "Green"})
        }
    }

    //add coach, mentor and officer to data
    for(let i = 0; i < districtdata.length; i++){
        Object.assign(districtdata[i], {'Club Coach': []})
        Object.assign(districtdata[i], {'Peer Mentor': []})
        Object.assign(districtdata[i], {'Officer': []})
        Object.assign(districtdata[i], {'Members Achievements': []})
    }
    for(let i = 0; i < officerdata.length; i++){
        for(let j = 0; j < districtdata.length; j++){
            if(officerdata[i]["Club"].toString().padStart(8, "0") === districtdata[j]["Club"]){
                let obj = {}
                Object.assign(obj, {'List Status': officerdata[i]["List Status"]})
                Object.assign(obj, {'Election': officerdata[i]["Election"]})
                Object.assign(obj, {'Name': officerdata[i]["Name"]})
                districtdata[j]['Officer'].push(obj)
            }
        }
    }
    for(let i = 0; i < coachdata.length; i++){
        for(let j = 0; j < districtdata.length; j++){
            if(coachdata[i]["Club"].toString().padStart(8, "0") === districtdata[j]["Club"]){
                if(coachdata[i]['Status'] === 'PENDING') {
                    let obj = {}
                    Object.assign(obj, {'Division': districtdata[j]['Division']})
                    Object.assign(obj, {'Area': districtdata[j]['Area']})
                    Object.assign(obj, {'Club Number': coachdata[i]["Club"]})
                    Object.assign(obj, {'Club Name': coachdata[i]["Club Name"]})
                    Object.assign(obj, {'Code': coachdata[i]["Code"]})
                    Object.assign(obj, {'Name': coachdata[i]["Name"]})
                    Object.assign(obj, {'Begin Date': coachdata[i]["Begin Date"]})
                    Object.assign(obj, {'Status': coachdata[i]["Status"]})
                    districtdata[j]['Club Coach'].push(obj)
                }
            }
        }
    }
    for(let i = 1; i < membersdata.length; i++){
        for(let j = 0; j < districtdata.length; j++){
            if(membersdata[i]["Club"].toString().padStart(8, "0") === districtdata[j]["Club"]){
                //console.log(officerdata[i] + " " + districtdata[j])
                let obj = {}
                Object.assign(obj, {'Member': membersdata[i]["Member"]})
                Object.assign(obj, {'Award': membersdata[i]["Award"]})
                Object.assign(obj, {'Date': membersdata[i]["Date"]})
                if(obj['Award'] === 'PWMENTORPGM'){
                    districtdata[j]['Peer Mentor'].push(obj)
                } else {
                    districtdata[j]['Members Achievements'].push(obj)
                }

            }
        }
    }

    const groupBy = key => array =>
        array.reduce((objectsByKeyValue, obj) => {
            const value = obj[key];
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
            return objectsByKeyValue;
        }, {});

    const groupByMember = groupBy("Member")

    for(let i = 0; i < districtdata.length;i++){
        districtdata[i]['Members Achievements'] = groupByMember(districtdata[i]['Members Achievements'])
    }
    const jsonString = JSON.stringify(districtdata)
    /*
    fs.writeFile('data.json', jsonString, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            //console.log('Successfully wrote file')
        }
    })
    */
    return districtdata

}

async function getDistrictStats(month, year){
    let prevyear = (parseInt(year)-1).toString()
    let html = await axios.get('http://dashboards.toastmasters.org/' + prevyear + '-' + year + '/District.aspx?id=40')
    let $ = await cheerio.load(html.data)
    let values = []
    $('.chart_table_big_numbers').each((_, e) => {
        values.push($(e).text())
        //console.log($(e).text());
    });
    let stats = []
    let obj = {}
    Object.assign(obj,{'Paid Base': values[0]})
    Object.assign(obj,{'Paid To Date': values[1]})
    Object.assign(obj,{'Payments Base': values[2]})
    Object.assign(obj,{'Payments To Date': values[3]})
    Object.assign(obj,{'Distinguished Base': values[4]})
    Object.assign(obj,{'Distinguished To Date': values[5]})
    stats.push(obj)
    return obj
}

module.exports = {getData, getClubCoaches, getClubPerformance, getDistrictPerformance, getDivisionPerformance, getOfficersList, getMemberAchievements, getDistrictData, compileData, getDistrictStats, scrapedata}