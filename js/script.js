
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

