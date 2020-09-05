const express = require('express');
const path = require('path');
const request = require('request');
const router = express.Router();

const app = express();

require('dotenv').config({
  path: 'comicsWeb.env'
})

app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "pug")

app.use(express.static(path.join(__dirname, "public")));

const comicUri = process.env.COMIC_SOURCE_URI || "http://xkcd.com";
const comicInfo = process.env.COMIC_SOURCE_INFO || "/info.0.json";

var _latestNum = 0;

function getNavInfo(comicNum) {
  if (_latestNum < comicNum) {
    _latestNum = comicNum;
  }
  return {
    isFirst: comicNum == 1,
    isLast: comicNum == _latestNum,
    prevNum: comicNum - 1,
    nextNum: comicNum + 1,
    uri: comicUri,
    jsonRes: comicInfo
  };
}

router.get('/:comicNum/info.0.json', (req, res) => {
  var comicAPI = comicUri + '/' + req.params.comicNum + comicInfo
  request(comicAPI, {
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('error:', error);
      res.send(body)
    }
    var issueDate = body.day + "/" + body.month + "/" + body.year
    res.render("index", {
      comic: body,
      issueDate: issueDate,
      comicNav: getNavInfo(body.num)
    });
  });
});

router.get('/', (req, res) => {
  var comicAPI = comicUri + comicInfo;
  console.log("Comic URL: " + comicAPI);
  request(comicAPI, {
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('error:', error);
      res.send(body)
    }
    var issueDate = body.day + "/" + body.month + "/" + body.year
    res.render("index", {
      comic: body,
      issueDate: issueDate,
      comicNav: getNavInfo(body.num)
    });
  });
});

module.exports = router;