//District Functions

//Division Functions
function getAllDivisions(data){
    let divisions = new Set()
    for(let i = 0; i < data.length; i++){
        divisions.add(data[i]['Division'])
    }
    return Array.from(divisions)
}

function getDivision(name, data){
    let divisionobj = {}
    let clubcount = 0
    let lowcount = 0
    let activecount = 0
    let inelligiblecount = 0
    let suspendedcount = 0
    let train1 = 0
    let train2 = 0
    let mayvisits = 0
    let novvisits = 0
    let officercount = 0
    let newMembers  =0;
    let zeroPlus = 0;
    let octduesCount = 0;
    let aprduesCount = 0;
    let almostpaid = 0;
    let almostdist = 0;
    for(let i = 0; i < data.length; i++) {
        if(data[i]['Division'] === name){
            clubcount++
            if(data[i]['Club Status'] === "Low"){
                lowcount++
            } else if(data[i]['Club Status'] === "Active"){
                activecount++
            } else if(data[i]['Club Status'] === "Suspended"){
                suspendedcount++
            } else if(data[i]['Club Status'] === "Ineligible"){
                inelligiblecount++
            }
            if(parseInt(data[i]['Off. Trained Round 1']) >= 4){
                train1++
            }
            if(parseInt(data[i]['Off. Trained Round 2']) >= 4){
                train2++
            }
            if(parseInt(data[i]['Nov Visit award']) > 0){
                novvisits++
            }
            if(parseInt(data[i]['May Visit award']) > 0){
                mayvisits++
            }
            if(data[i]['Officer'].length > 0){
                officercount++
            }
            if(parseInt(data[i]['Active Members']) > 0){
                zeroPlus++
            }
            if(parseInt(data[i]['October Renewals']) >= 1){
                octduesCount++
            }
            if(parseInt(data[i]['April Renewals']) >= 1){
                aprduesCount++
            }
            if ((parseInt(data[i]['Active Members']) > parseInt(data[i]['Mem. Base'])) || parseInt(data[i]['Active Members']) >= 20) {
                almostpaid++
            }
            if (data[i]['Goals Met'] >= 5) {
                almostdist++
            }
            newMembers = newMembers + parseInt(data[i]['New Members'])
            newMembers = newMembers + parseInt(data[i]['Add. New Members'])
        }
    }
    let paidbase = 0
    let paiddate = 0;
    let paidgoals = 0
    let distbase = 0;
    let distgoals = 0;
    let distdate = 0;
    let areas = getAreasByDivision(name, data)
    for(let i = 0; i < areas.length; i++){
        for(let j = 0; j < data.length; j++){
            if(data[j]['Area'] === areas[i]){
                paidbase = paidbase + parseInt(data[i]['Area Club Base'])
                paiddate = paiddate + parseInt(data[i]['Total Paid Area Clubs'])
                distdate = distdate + parseInt(data[i]['Total Dist. Area Clubs'])
                break;
            }
        }
    }
    let clubs = getClubsByDivision(name, data)
    let df = []
    for(let i = 0; i < data.length; i++){
        if(data[i]['Division'] === name){
            df.push(data[i])
        }
    }
    Object.assign(divisionobj, {"Paid Base": paidbase})
    Object.assign(divisionobj, {"Paid To Date": paiddate})
    Object.assign(divisionobj, {"Distinguished To Date": distdate})
    Object.assign(divisionobj, {"Distinguished Base": paidbase})
    Object.assign(divisionobj, {"Paid Goals":paidbase })
    Object.assign(divisionobj, {"Distinguished Goals": Math.ceil((parseInt(paidbase) * .4)) })
    Object.assign(divisionobj, {"Paid Almost": almostpaid})
    Object.assign(divisionobj, {"Distinguished Almost": almostdist})
    Object.assign(divisionobj, {'Total Clubs': clubcount})
    Object.assign(divisionobj, {'Low': lowcount})
    Object.assign(divisionobj, {'Active': activecount})
    Object.assign(divisionobj, {'Ineligible': inelligiblecount})
    Object.assign(divisionobj, {'Suspended': suspendedcount})
    Object.assign(divisionobj, {'Training 1': train1})
    Object.assign(divisionobj, {'Training 2': train2})
    Object.assign(divisionobj, {'May Visits': mayvisits})
    Object.assign(divisionobj, {'Nov Visits': novvisits})
    Object.assign(divisionobj, {'Officer Count': officercount})
    Object.assign(divisionobj, {'New Members': newMembers})
    Object.assign(divisionobj, {'Zero Plus Members': zeroPlus })
    Object.assign(divisionobj, {'Oct Dues': octduesCount })
    Object.assign(divisionobj, {'Apr Dues': aprduesCount })
    Object.assign(divisionobj, {'Areas': areas })
    Object.assign(divisionobj, {'Clubs': clubs })
    Object.assign(divisionobj, {'Data': df })
    return divisionobj
}

//Area Functions
function getAreasByDivision(division, data){
    let areas = new Set()
    for(let i = 0; i < data.length; i++){
        if(data[i]['Division'] === division){
            areas.add(data[i]['Area'])
        }
    }
    return Array.from(areas)
}

function getArea(name, data) {
    let area = {}
    let clubs = getClubsByArea(name, data)
    clubs = Array.from(clubs)
    Object.assign(area, {Clubs: clubs})
    for(let i = 0; i < data.length; i++){
        if(data[i]['Area'] === name){
            Object.assign(area, {Division: data[i]['Division']})
            break;
        }
    }
    let clubcount = 0
    let lowcount = 0
    let activecount = 0
    let inelligiblecount = 0
    let suspendedcount = 0
    let train1 = 0
    let train2 = 0
    let mayvisits = 0
    let novvisits = 0
    let officercount = 0;
    let almostpaid = 0;
    let almostdist = 0;

    for(let i = 0; i < data.length; i++) {
        if(data[i]['Area'] === name){
            clubcount++
            if(data[i]['Club Status'] === "Low"){
                lowcount++
            } else if(data[i]['Club Status'] === "Active"){
                activecount++
            } else if(data[i]['Club Status'] === "Suspended"){
                suspendedcount++
            } else if(data[i]['Club Status'] === "Ineligible"){
                inelligiblecount++
            }
            if(parseInt(data[i]['Off. Trained Round 1']) >= 4){
                train1++
            }
            if(parseInt(data[i]['Off. Trained Round 2']) >= 4){
                train2++
            }
            if(parseInt(data[i]['Nov Visit award']) > 0){
                novvisits++
            }
            if(parseInt(data[i]['May Visit award']) > 0){
                mayvisits++
            }
            if(data[i]['Officer'].length > 0){
                officercount++
            }
            if ((parseInt(data[i]['Active Members']) > parseInt(data[i]['Mem. Base'])) || parseInt(data[i]['Active Members']) >= 20) {
                almostpaid++
            }
            if (data[i]['Goals Met'] >= 5) {
                almostdist++
            }
        }
    }
    for(let i = 0; i < data.length; i++) {
        if (data[i]['Area'] === name) {
            Object.assign(area, {'Paid Base': data[i]['Area Club Base']})
            Object.assign(area, {'Paid To Date': data[i]['Total Paid Area Clubs']})
            Object.assign(area, {'Paid Goals':data[i]['Area Club Base']})
            Object.assign(area, {'Distinguished To Date': data[i]['Total Dist. Area Clubs']})
            Object.assign(area, {'Distinguished Goals':Math.ceil((parseInt(data[i]['Area Club Base']) * .5))})
            Object.assign(area, {"Distinguished Base": data[i]['Area Club Base']})
            break;
        }
    }
    Object.assign(area, {"Paid Almost": almostpaid})
    Object.assign(area, {"Distinguished Almost": almostdist})
    Object.assign(area, {'Total Clubs': clubcount})
    Object.assign(area, {'Low': lowcount})
    Object.assign(area, {'Active': activecount})
    Object.assign(area, {'Ineligible': inelligiblecount})
    Object.assign(area, {'Suspended': suspendedcount})
    Object.assign(area, {'Training 1': train1})
    Object.assign(area, {'Training 2': train2})
    Object.assign(area, {'May Visits': mayvisits})
    Object.assign(area, {'Nov Visits': novvisits})
    Object.assign(area, {'Officer Count': officercount})
    return area
}

function getAllAreas(data){
    let areas = new Set()
    for(let i = 0; i < data.length; i++){
        areas.add(data[i]['Area'])
    }
    //console.log(areas)
    return Array.from(areas)
}

//Club Functions
function getClubsByDivision(division, data){
    let clubs = new Set()
    for(let i = 0; i < data.length; i++){
        if(data[i]['Division'] === division){
            clubs.add(data[i]['Club Name'])
        }
    }
    //console.log(clubs)
    return Array.from(clubs)
}

function getClubsByArea(area, data){
    let clubs = new Set()
    for(let i = 0; i < data.length; i++){
        if(data[i]['Area'] === area){
            clubs.add(data[i])
        }
    }
    //console.log(clubs)
    return Array.from(clubs)
}

function getAllClubs(data){
    let clubs = new Set()
    for(let i = 0; i < data.length; i++){
        clubs.add(data[i]['Club Name'])
    }
    //console.log(clubs)
    return Array.from(clubs)
}

function getClub(name, data){
    let obj = {}
    for(let i = 0; i < data.length; i++){
        if(data[i]['Club Name'].trim() === name){
            obj = data[i]
            break;
        }
    }
    return obj
}

//***
function getMembershipData(division, data){
    let dataset = []
    let clubs = data
    let divisionlist = getAllDivisions(data)
    divisionlist = Array.from(divisionlist)
    if(division === "all"){
        for(let i = 0; i < divisionlist.length; i++){
            let obj = {}
            Object.assign(obj, {label: "Division " + divisionlist[i]})
            Object.assign(obj, {backgroundColor: ""})
            let d = []
            let zero = 0;
            let seven = 0;
            let twelve = 0;
            let nineteen = 0;
            let twenty = 0;
            for(let j = 0; j < data.length; j++){
                if(data[j]['Division'] === divisionlist[i]) {
                    if (parseInt(data[j]['Active Members']) <= 0) {
                        zero++
                    } else if (parseInt(data[j]['Active Members']) <= 7) {
                        seven++
                    } else if (parseInt(data[j]['Active Members']) <= 12) {
                        twelve++
                    } else if (parseInt(data[j]['Active Members']) <= 19) {
                        nineteen++
                    } else if (parseInt(data[j]['Active Members']) >= 20) {
                        twenty++
                    }
                }
            }
            d.push(zero)
            d.push(seven)
            d.push(twelve)
            d.push(nineteen)
            d.push(twenty)
            Object.assign(obj, {data: d})
            dataset.push(obj)
        }
    } else {
        let arealist = getAreasByDivision(division, data)
        for(let i = 0; i < arealist.length; i++){
            let obj = {}
            Object.assign(obj, {label: "Area " + arealist[i]})
            Object.assign(obj, {backgroundColor: ""})
            let d = []
            let zero = 0;
            let seven = 0;
            let twelve = 0;
            let nineteen = 0;
            let twenty = 0;
            for(let j = 0; j < data.length; j++){
                if(data[j]['Area'] === arealist[i]) {
                    if (parseInt(data[j]['Active Members']) <= 0) {
                        zero++
                    } else if (parseInt(data[j]['Active Members']) <= 7) {
                        seven++
                    } else if (parseInt(data[j]['Active Members']) <= 12) {
                        twelve++
                    } else if (parseInt(data[j]['Active Members']) <= 19) {
                        nineteen++
                    } else if (parseInt(data[j]['Active Members']) >= 20) {
                        twenty++
                    }
                }
            }
            d.push(zero)
            d.push(seven)
            d.push(twelve)
            d.push(nineteen)
            d.push(twenty)
            Object.assign(obj, {data: d})
            dataset.push(obj)
        }
    }
    return dataset
}

module.exports = {getMembershipData, getDivision, getArea, getAllDivisions, getClubsByDivision, getClubsByArea, getAreasByDivision, getAllClubs, getAllAreas, getClub}