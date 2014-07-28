define(function(require, exports, module) {

  var $ = require("jquery"),
      hogan = require("hogan"),
      controller = require("../controller/DerbyTrackerController"),
      translator = require("../controller/DerbyTrackerTranslator"),
      bracketTemplate = hogan.compile(require('text!tpl/bracket.html')),
      fieldViewTemplate = hogan.compile(require('text!tpl/target-field-svg.html')),
      fieldHitsTemplate = hogan.compile(require('text!tpl/field-hits-container.html')),
      nowBattingTemplate = hogan.compile(require('text!tpl/now-batting.html')),
      roundOneBattersListTemplate = hogan.compile(require('text!tpl/round-one-batters-list.html')),
      roundTwoBattersBracketTemplate = hogan.compile(require('text!tpl/round-two-batters-bracket.html')),
      roundThreeBattersBracketTemplate = hogan.compile(require('text!tpl/round-three-batters-bracket.html')),
      roundFourBattersBracketTemplate = hogan.compile(require('text!tpl/round-four-batters-bracket.html')),
      mainTrackerTemplate = hogan.compile(require('text!tpl/tracker-template.html')),
      BRACKET_CONTAINER,
      BATTERS_CONTAINER,
      NOW_BATTING_CONTAINER,
      FIELD_HITS_CONTAINER;

  function handleInitialTrackerDataUpdate(args) {
    controller.off("DerbyTrackerEvent.UPDATE", handleInitialTrackerDataUpdate);
    controller.on("DerbyTrackerEvent.UPDATE", handleTrackerDataUpdate);

    //bind to round header tab clicks
    $("#round-header li").on("click", function(e) {
      if(!$(this).hasClass("occurred")) return;

      //add active class to clicked li
      $(this).siblings().removeClass();
      $(this).addClass("active");

      //dispatch a go to round event which update our current round index on the model as well as trigger a re-render of our view
      controller.dispatchEvent("DerbyTrackerEvent.GO_TO_ROUND", {roundIdx: $(this).index()});
    });

    handleTrackerDataUpdate(args);
  }

  function handleTrackerDataUpdate(args) {
    //enable round tabs
    var currentRound = args.getTrackerFileVO().getCurrentRoundIndex();
    while(currentRound > -1) {
      $("#round-header li:eq("+currentRound+")").removeClass().addClass("occurred");
      currentRound--;
    }
    //set current round label as "active"
    $("#round-header li:eq("+(args.getCurrentRoundIndex())+")").addClass("active");

    //render bracket
    renderBracket(args);

    //render batters list (or bracket)
    renderBattersSubView(args);

    //render now batting
    renderNowBattingView(args);

    //render field area
    renderFieldView(args);

    //dispatch a view update event
    controller.dispatchEvent("DerbyTrackerEvent.VIEW_UPDATE");
  }

  function renderBracket(args) {
    //empty the bracket
    BRACKET_CONTAINER.empty();

    //render it
    BRACKET_CONTAINER.append(bracketTemplate.render({playerOrder: args.getTrackerFileVO().getPlayerOrder()}));

    //add 'active' class to currently viewed round
    $("#bracket-container div.round"+(args.getCurrentRoundIndex()+1)+" div.cell").addClass("active");

    //add 'batting' class to current batter
    $("#bracket-container div.round"+(args.getTrackerFileVO().getCurrentRoundIndex()+1)+" div[data-id="+args.getTrackerFileVO().getRosterVO().getNowBattingVO().getPlayerID()+"]").addClass("batting");
  }

  function renderBattersSubView(args) {
    //empty the container
    BATTERS_CONTAINER.empty();

    //figure out what views we need to append
    switch(args.getCurrentRoundIndex()) {
      case 0:
        //current round player order
        var playerOrder = args.getTrackerFileVO().getPlayerOrder()[0];
        //console.dir(playerOrder);
        var completePlayers = [];
        for(var i=0,l=playerOrder.length;i<l;i++) {
          completePlayers.push(args.getTrackerFileVO().getRosterVO().getPlayerByID(playerOrder[i]));
        }
        BATTERS_CONTAINER.append(roundOneBattersListTemplate.render({players: completePlayers, translator: translator}));
        break;
      case 1:
        //current round player order
        var playerOrder = args.getTrackerFileVO().getPlayerOrder()[1];
        var completePlayers = [];
        for(var i=0,l=playerOrder.length;i<l;i++) {
          completePlayers.push(args.getTrackerFileVO().getRosterVO().getPlayerByID(playerOrder[i]));
        }
        BATTERS_CONTAINER.append(roundTwoBattersBracketTemplate.render({players: completePlayers, translator: translator}));
        break;
      case 2:
        //current round player order
        var playerOrder = args.getTrackerFileVO().getPlayerOrder()[2];
        var completePlayers = [];
        for(var i=0,l=playerOrder.length;i<l;i++) {
          completePlayers.push(args.getTrackerFileVO().getRosterVO().getPlayerByID(playerOrder[i]));
        }
        BATTERS_CONTAINER.append(roundThreeBattersBracketTemplate.render({players: completePlayers, translator: translator}));
        break;
      case 3:
        //current round player order
        var playerOrder = args.getTrackerFileVO().getPlayerOrder()[3];
        var completePlayers = [];
        for(var i=0,l=playerOrder.length;i<l;i++) {
          completePlayers.push(args.getTrackerFileVO().getRosterVO().getPlayerByID(playerOrder[i]));
        }
        BATTERS_CONTAINER.append(roundFourBattersBracketTemplate.render({players: completePlayers, translator: translator}));
        break;
    }
  }

  function renderNowBattingView(args) {
    //empty now batting 
    NOW_BATTING_CONTAINER.empty();

    //add now batting view
    NOW_BATTING_CONTAINER.append(nowBattingTemplate.render({currentBatter: args.getTrackerFileVO().getRosterVO().getNowBattingVO(), translator: translator}));

    //check if we have a winner
    if(typeof args.getTrackerFileVO().getRosterVO().getWinningBatterVO() !== "undefined") {
      $("#now-batting-container span.title").html(translator.getWinner());
    }
  }

  function renderFieldView(args) {
    //empty the hits
    FIELD_HITS_CONTAINER.empty();

    //get the swings for this round
    var swings = args.getTrackerFileVO().getRosterVO().getNowBattingVO().getAtBatByRound(args.getCurrentRoundIndex()+1);
    FIELD_HITS_CONTAINER.append(fieldHitsTemplate.render({swings: swings}));

    //turn off any prior binding
    FIELD_HITS_CONTAINER.find("div.hit").off("mouseover").off("mouseout");

    //add binding to the hit overlays for tool tips
    FIELD_HITS_CONTAINER.find("div.hit").on("mouseover", function() {
      FIELD_HITS_CONTAINER.find("div.hit-hover[data-hitnum="+$(this).attr("data-hitnum")+"]").show();
    }).on("mouseout", function() {
      FIELD_HITS_CONTAINER.find("div.hit-hover[data-hitnum="+$(this).attr("data-hitnum")+"]").hide();
    });
  }
  
  exports.init = function(containerID) {

    //add our main template to the stage
    $(containerID).append(mainTrackerTemplate.render({translator: translator}));

    BRACKET_CONTAINER = $("#bracket-container");
    BATTERS_CONTAINER = $("#batters-container");
    NOW_BATTING_CONTAINER = $("#now-batting-container");
    FIELD_HITS_CONTAINER = $("#field-hits-container");
    //add the field svg one-time
    FIELD_HITS_CONTAINER.before(fieldViewTemplate.render({}));

    //bind to data update events
    controller.on("DerbyTrackerEvent.UPDATE", handleInitialTrackerDataUpdate);
  };
});