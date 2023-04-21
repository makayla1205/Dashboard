var express = require('express');
var router = express.Router();
const fs = require("fs");
const Papa = require('papaparse');
const {json} = require("express");
const axios = require("axios");
const helper = require('../helper');
const { getData } = require('../functions');

/* GET home page. */
/* District dashboard */
router.get('/', function(req, res, next) {
  let year = req.app.locals.year
  if (year === undefined) {
    year = new Date().getFullYear().toString()
  }
  let month = req.app.locals.month
  if (month === undefined) {
    month = (new Date().getMonth() + 1).toString()
    if (month.length < 2) {
      month = '0' + month
    }
  }
  let area = "all"
  let division = "all"
  let club = "none"
  res.render('district', {title: 'District 40', page: 'Dashboard', year, month, area, division, club})
});


/* Division dashboard */
router.get('/division/:divisionId', function(req, res, next) {
  let year = req.app.locals.year
  if(year === undefined){
    year = new Date().getFullYear()
  }
  let month = req.app.locals.month
  if(month === undefined){
    month = (new Date().getMonth() + 1).toString()
    if (month.length<2){
      month = '0'+ month
    }
  }
  let division = req.params.divisionId
  let area = "all"
  let club = "none"
  res.render('division', { title: 'Division '+ req.params.divisionId, page: 'Dashboard', year: year, month: month, division: division, area:area, club: club});
});


/* Area dashboard */
router.get('/area/:areaId', function(req, res, next) {
  let year = req.app.locals.year
  if(year === undefined){
    year = new Date().getFullYear()
  }
  let month = req.app.locals.month
  if(month === undefined){
    month = (new Date().getMonth() + 1).toString()
    if (month.length<2){
      month = '0'+ month
    }
  }
  let area = req.params.areaId
  let club = "none"
  res.render('area', { title: 'Area '+ req.params.areaId, page: 'Dashboard', year: year, month: month, area:area, club: club});
});


/* Club dashboard */
router.get('/club/:clubId', function(req, res, next) {
  let year = req.app.locals.year
  if(year === undefined){
    year = new Date().getFullYear()
  }
  let month = req.app.locals.month
  if(month === undefined){
    month = (new Date().getMonth() + 1).toString()
    if (month.length<2){
      month = '0'+ month
    }
  }
  let club = req.params.clubId
  res.render('club', { title: req.params.clubId, page: 'Dashboard', year: year, month: month, club: club});
});

router.get('/reports', function(req, res){
  let year = req.app.locals.year
  if(year === undefined){
    year = new Date().getFullYear()
  }
  let month = req.app.locals.month
  if(month === undefined){
    month = (new Date().getMonth() + 1).toString()
    if (month.length<2){
      month = '0'+ month
    }
  }

  let reportYear = req.query.year
  let reportMonth = req.query.month
  if (reportYear === undefined || reportMonth === undefined){
      reportMonth = (new Date().getMonth()+1).toString()
      if (reportMonth.length<2) {
        reportMonth = '0' + reportMonth
      }
      reportYear = new Date().getFullYear()
  }
  res.render('reports', {title: 'Reports', page: 'Reports', reportYear, reportMonth})
});

router.get('/update/year', async function(req, res, next) {
  let club = req.query.club
  let date = req.query.date.split("-")
  let year = date[0]
  let month = date[1]
  if(parseInt(year) < 2009 || parseInt(year) > new Date().getFullYear()){
    res.redirect(req.get('referer'))
  }
  if(parseInt(month) < 1 || parseInt(month) > 13){
    res.redirect(req.get('referer'))
  }
  let area = req.query.area
  let division = req.query.division
  req.app.locals.year = year
  req.app.locals.month = month
  //console.log(req.query)
  
  try {
    req.app.locals.data = await getData(month, year)
    res.redirect(req.get('referer'))
  } catch (error) {
    console.log(error);
  }
});

router.get('/update/report', function (req, res){
  let date = req.query.reportDate.split('-')
  let reportYear = date[0]
  let reportMonth = date[1]
  res.redirect('/reports?year='+ reportYear + "&month=" + reportMonth)
});

//Returns District Data
router.get('/getdistrict', async (req, res) => {
  let year = req.app.locals.year
  if(year === undefined){
    year = new Date().getFullYear()
  }
  let month = req.app.locals.month
  if(month === undefined){
    month = (new Date().getMonth() + 1).toString()
    if (month.length<2){
      month = '0'+ month
    }
  }
  let data = []
  if(req.app.locals.data == undefined){
    try {
      req.app.locals.data = await getData(month, year)
    } catch (error) {
      console.log(error);
      req.app.locals.data = []
    }
  }
  let clublist = helper.getAllClubs(req.app.locals.data)
  clublist = clublist.sort()
  let arealist = helper.getAllAreas(req.app.locals.data)
  let divisionlist = helper.getAllDivisions(req.app.locals.data)
  let obj = {}
  Object.assign(obj, {'Area List': arealist})
  Object.assign(obj, {'Club List': clublist})
  Object.assign(obj, {'Division List': divisionlist})
  Object.assign(obj, {'Area': "all"})
  Object.assign(obj, {'Division': "all"})
  Object.assign(obj, {'Club': "none"})
  res.json({data:req.app.locals.data, list: obj})
})

//Returns Division Data
router.get('/getdivision', async (req, res) => {
  let division = req.query.division
  let year = req.app.locals.year
  if(year === undefined){
    year = new Date().getFullYear()
  }
  let month = req.app.locals.month
  if(month === undefined){
    month = (new Date().getMonth() + 1).toString()
    if (month.length<2){
      month = '0'+ month
    }
  }
  let data = []
  if(req.app.locals.data == undefined){
    try {
      req.app.locals.data = await getData(month, year)
    } catch (error) {
      console.log(error);
      req.app.locals.data = []
    }
  }
  let area = req.query.area
  let club = req.query.club
  let currclub = ""
  let currarea = ""
  let currdiv = ""
  for(let i = 0; i < req.app.locals.data.length; i++){
    if(req.app.locals.data[i]['Division'] === division){
        currdiv = req.app.locals.data[i]['Division']
        break;
    }
  }
  let clublist = helper.getClubsByDivision(currdiv, req.app.locals.data)
  clublist = clublist.sort()
  let arealist = helper.getAreasByDivision(currdiv, req.app.locals.data)
  let divisionlist = helper.getAllDivisions(req.app.locals.data)
  currclub = 'none'
  currarea = "all"
  let obj = {}
  Object.assign(obj, {'Area List': arealist})
  Object.assign(obj, {'Club List': clublist})
  Object.assign(obj, {'Division List': divisionlist})
  Object.assign(obj, {'Area': currarea})
  Object.assign(obj, {'Division': currdiv})
  Object.assign(obj, {'Club': currclub})
  dataset = helper.getDivision(division,req.app.locals.data)
  res.json({data: dataset, list: obj})
})

//Returns Area Data
router.get('/getarea', async (req, res) => {
  let area = req.query.area
  let year = req.app.locals.year
  if(year === undefined){
    year = new Date().getFullYear()
  }
  let month = req.app.locals.month
  if(month === undefined){
    month = (new Date().getMonth() + 1).toString()
    if (month.length<2){
      month = '0'+ month
    }
  }
  let data = []
  if(req.app.locals.data == undefined){
    try {
      req.app.locals.data = await getData(month, year)
    } catch (error) {
      console.log(error);
      req.app.locals.data = []
    }
  }
  let currclub = ""
  let currarea = ""
  let currdiv = ""
  let divisionlist = helper.getAllDivisions(req.app.locals.data)
  for(let i = 0; i < req.app.locals.data.length; i++){
    if(req.app.locals.data[i]['Area'] === area){
        currclub = 'none'
        currarea = req.app.locals.data[i]['Area']
        currdiv = req.app.locals.data[i]['Division']
        break;
    }
}
let clublist = helper.getClubsByArea(currarea, req.app.locals.data)
clublist = clublist.sort()
let arealist = helper.getAreasByDivision(currdiv, req.app.locals.data)
let obj = {}
Object.assign(obj, {'Area List': arealist})
Object.assign(obj, {'Club List': clublist})
Object.assign(obj, {'Division List': divisionlist})
Object.assign(obj, {'Area': currarea})
Object.assign(obj, {'Division': currdiv})
Object.assign(obj, {'Club': currclub})
  dataset = helper.getArea(area, req.app.locals.data)
  res.json({data: dataset, list: obj})
})

//Returns Club Data
router.get('/getclub', async (req, res) => {
  let club = req.query.club
  let year = req.app.locals.year
  if(year === undefined){
    year = new Date().getFullYear()
  }
  let month = req.app.locals.month
  if(month === undefined){
    month = (new Date().getMonth() + 1).toString()
    if (month.length<2){
      month = '0'+ month
    }
  }
  let data = []
  if(req.app.locals.data == undefined){
    try {
      req.app.locals.data = await getData(month, year)
    } catch (error) {
      console.log(error);
      req.app.locals.data = []
    }
  }
  let currclub = ""
  let currarea = ""
  let currdiv = ""
  let divisionlist = helper.getAllDivisions(req.app.locals.data)
  for(let i = 0; i < req.app.locals.data.length; i++){
    if(req.app.locals.data[i]['Club Name'].trim() === club){
        currclub = req.app.locals.data[i]['Club Name']
        currarea = req.app.locals.data[i]['Area']
        currdiv = req.app.locals.data[i]['Division']
        break;
    }
  }
  let clublist = helper.getClubsByArea(currarea, req.app.locals.data)
  clublist = clublist.sort()
  let arealist = helper.getAreasByDivision(currdiv, req.app.locals.data)
  let obj = {}
  Object.assign(obj, {'Area List': arealist})
  Object.assign(obj, {'Club List': clublist})
  Object.assign(obj, {'Division List': divisionlist})
  Object.assign(obj, {'Area': currarea})
  Object.assign(obj, {'Division': currdiv})
  Object.assign(obj, {'Club': currclub})
  dataset = helper.getClub(club, req.app.locals.data)
  res.json({data: dataset, list: obj})
})

//Returns Membership Chart Data for District Page
router.get('/fetch/membershipchart', async (req, res) => {
  let division = req.query.division
  let dataset = []
  let year = req.app.locals.year
  if(year === undefined){
    year = new Date().getFullYear()
  }
  let month = req.app.locals.month
  if(month === undefined){
    month = (new Date().getMonth() + 1).toString()
    if (month.length<2){
      month = '0'+ month
    }
  }
  let data = []
  if(req.app.locals.data == undefined){
    try {
      req.app.locals.data = await getData(month, year)
    } catch (error) {
      console.log(error);
      req.app.locals.data = []
    }
  }
  dataset = helper.getMembershipData(division, req.app.locals.data)
  res.json(dataset)
})

module.exports = router;

