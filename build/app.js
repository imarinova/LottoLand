(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var $               = require('jquery');
var _               = require('underscore');
var _date           = require('_date');
var utils           = require('./utils.js');
var JSON_DATA       = require('../json/game.json');

$(function() {
    Lottoland.init();
});

// underscore templates for easy html formatting
var tplNumber   = _.template("<li class=<%=className%>><%=value%></li>"); 
var tplRank     = _.template("<tr>" + 
                                "<td class='rank'><%=tier%></td>" +
                                "<td><%=success%></td>" + 
                                "<td class='number text-right'><%=winners%>x</td>" +
                                "<td class='text-right bold'><%=prize%></td>" +
                            "</tr>");

// structure that cares for missing data in json. 
var rankNomenclature = {
    rank1: "5 numbers, 2 euronumbers",
    rank2: "5 numbers, 1 euronumbers",
    rank3: "5 numbers, 0 euronumbers",
    rank4: "4 numbers, 2 euronumbers",
    rank5: "4 numbers, 1 euronumbers",
    rank6: "4 numbers, 0 euronumbers",
    rank7: "3 numbers, 0 euronumbers",
    rank8: "3 numbers, 1 euronumbers",
    rank9: "3 numbers, 0 euronumbers",
    rank10:"2 numbers, 2 euronumbers",
    rank11:"2 numbers, 1 euronumbers",
    rank12:"2 numbers, 0 euronumbers",
    rank13:"1 numbers, 2 euronumbers",
    rank14:"1 numbers, 1 euronumbers"
};

var Lottoland = {

    //append to html structure euro jackpot numbers
    buildNumbersHtml : function(json) {       
        var numbers = [];         

        json.numbers.forEach(function(entry) {
            numbers.push(tplNumber({className : "", value:entry}));
        });

        json.euroNumbers.forEach(function(number) {
            numbers.push(tplNumber({className : "euro-number", value:number}));
        });

        $( "<ul />", {
             html: numbers.join(""),
             class: 'numbers-result'
        }).appendTo( ".numbers_container" );
    },

    //process json data to comfortable structure
    processWinners : function(json) { 
        var obj =   json.odds,
            ranksArr = [];

        for (var key in obj) {
            if ( obj.hasOwnProperty(key) ) {
                var rank = obj[key];
                rank.index = ~~key.slice(4);
                rank.key = key;
                ranksArr.push(rank);
            }
        }

        ranksArr = ranksArr.sort(function(a, b) {
            if (a.index < b.index)
                return -1;
            if (a.index > b.index)
                return 1;
            return 0;
        });

        return ranksArr;
    },

    //build html table for ranks
    buildRanksHtml : function(ranks) {
        
        ranks = ranks || [];
        var rankRows = [];

        for ( var i=0; i <ranks.length; i++ ) {
            var rank = ranks[i];

            if (rank.index === 0) {
                continue;
            }
            rankRows.push(tplRank({
                tier        : 'Tier ' + rank.index,
                success     : rankNomenclature[rank.key],
                winners     : rank.winners,
                prize       : utils.formatCurrency(rank.prize, '€')
            }));
        }

        $( "<table />", {
             html: rankRows.join("")
        }).appendTo( ".winners" );
    },

    buildHtmlLottoDate : function(lottoDate) {
        var date = new Date(lottoDate.year, lottoDate.month-1, lottoDate.day);

        var formattedDate = _date(date).format('dddd DD MMM YYYY');
        console.log(formattedDate);

        $('#lotto_date').text(formattedDate);
    },

    //init
    init: function () {
        if( JSON_DATA && JSON_DATA.length > 0 ) {
            var main = JSON_DATA[0].last;
        }

        this.buildNumbersHtml(main);    
        var ranks = this.processWinners(main);   
        this.buildRanksHtml(ranks); 
        this.buildHtmlLottoDate(main.date)
    }
};


},{"../json/game.json":3,"./utils.js":2,"_date":"_date","jquery":"jquery","underscore":"underscore"}],2:[function(require,module,exports){
//Format the currency
exports.formatCurrency = function(n, currency) {
    return currency + " " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
};

},{}],3:[function(require,module,exports){
module.exports=[
    {
        "last":
            {
                "nr":230,
                "currency":"EUR",
                "date":
                {
                    "full":"Die Lottozahlen vom Freitag, den 12.08.2016",
                    "day":12,
                    "month":8,
                    "year":2016,
                    "dayOfWeek":"Freitag"
                },
                "closingDate":"12.08.2016, 19:00",
                "lateClosingDate":"12.08.2016, 20:30",
                "numbers":[6,15,18,21,38],
                "euroNumbers":[1,4],
                "jackpot":15,
                "marketingJackpot":15,
                "specialMarketingJackpot":15,
                "climbedSince":2,
                "Winners":502764,
                "odds":
                {
                    "rank0":
                    {
                        "winners":0,
                        "specialPrize":0,
                        "prize":0
                    },
                    "rank1":
                    {
                        "winners":0,
                        "specialPrize":0,
                        "prize":1500000000
                    },
                    "rank2":
                    {
                        "winners":2,
                        "specialPrize":0,
                        "prize":115568770
                    },
                    "rank3":
                    {
                        "winners":4,
                        "specialPrize":0,
                        "prize":10222950
                    },
                    "rank8":
                    {
                        "winners":17730,
                        "specialPrize":0,
                        "prize":2380
                    },
                    "rank9":
                    {
                        "winners":23069,
                        "specialPrize":0,
                        "prize":1770
                    },
                    "rank10":
                    {
                        "winners":41929,
                        "specialPrize":0,
                        "prize":1390
                    },
                    "rank4":
                    {
                        "winners":28,
                        "specialPrize":0,
                        "prize":486800
                    },
                    "rank5":
                    {
                        "winners":550,
                        "specialPrize":0,
                        "prize":22300
                    },
                    "rank6":
                    {
                        "winners":980,
                        "specialPrize":0,
                        "prize":9730
                    },
                    "rank11":
                    {
                        "winners":91273,
                        "specialPrize":0,
                        "prize":1160
                    },
                    "rank7":
                    {
                        "winners":1226,
                        "specialPrize":0,
                        "prize":6670
                    },
                    "rank12":
                    {
                        "winners":325973,
                        "specialPrize":0,
                        "prize":790
                }
            }
        },
        "next":
        {
            "nr":231,
            "currency":"EUR",
            "date":
            {
                "full":"Die Lottozahlen vom Freitag, den 19.08.2016",
                "day":19,
                "month":8,
                "year":2016,
                "dayOfWeek":"Freitag"
            },
            "closingDate":"19.08.2016, 19:00",
            "lateClosingDate":"19.08.2016, 20:30",
            "jackpot":22,
            "marketingJackpot":22,
            "specialMarketingJackpot":22,
            "climbedSince":3
        }
    }
]


},{}]},{},[1]);
