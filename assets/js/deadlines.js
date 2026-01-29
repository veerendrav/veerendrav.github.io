var datasource = "/assets/json/deadlines.json"
var backi= -1;
var backtype = '';
var backapprox = false;

// HELPER FUNCTIONS
var timeLeftDescription = function(x) {

  var t = x.getTime();
  if(t<0) t=0;

  var tseconds = t / 1000;
  var seconds = Math.floor(tseconds) % 60;
  var tminutes = tseconds / 60;
  var minutes = Math.floor(tminutes) % 60;
  var thours = tminutes / 60;
  var hours = Math.floor(thours) % 24;
  var tdays = thours / 24;
  var days = Math.floor(tdays);

  return days + " days, " +
         ((hours < 10) ? "0" : "") + hours + "h " +
         ((minutes < 10) ? "0" : "") + minutes + "m " +
         ((seconds < 10) ? "0" : "") + seconds + "s";
}

// Convert AoE time to local time
var convertAoeToLocal = function(dateString) {
  var d = new Date(dateString);

  // Create a UTC date and add 12 hours to convert from AoE (UTC-12) to UTC
  var utcDate = new Date(Date.UTC(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  ));
  // Add 12 hours to convert from AoE to UTC
  utcDate.setUTCHours(utcDate.getUTCHours() + 12);

  return utcDate;
}

// load DATABASE
// Note: data is a list of json objects of this form containing, "venue", "area", "deadline" as parsable string for data (see http://www.w3schools.com/js/js_dates.asp) and optionally "approx" that indicates if the date is just based on a previous date
var deadlines_conferences = new Array();
var deadlines_conferences_approx = new Array();
var deadlines_journals = new Array();
var deadlines_journals_approx = new Array();
// probably not the best idea to make it synchronous, but the quick and dirty hack works for now
$.ajaxSetup({'async': false});
$.getJSON(datasource, function(data) {
  var now = new Date();
  for (var i in data) {
    var isJournal = (data[i].type === "journal");

    // Handle journals without deadlines (rolling submission)
    if (isJournal && !data[i].deadline) {
      // Add a far future date for journals without deadlines so they appear at the end
      data[i].deadline = new Date('2030/12/31');
      data[i].rolling = true;  // Mark as rolling submission
      deadlines_journals.push(data[i]);
      continue;
    }

    // Skip entries without deadlines that aren't journals
    if (!data[i].deadline) {
      continue;
    }

    // Parse the deadline and treat it as AoE time (UTC-12)
    d = convertAoeToLocal(data[i].deadline);

    while(d < now){
      d.setFullYear(d.getFullYear()+1);
      data[i].approx = 1;
    }
    data[i].deadline = d;

    // Separate by type AND approx status
    var isApprox = data[i].approx;

    if(isJournal && isApprox) {
      deadlines_journals_approx.push(data[i]);
    } else if(isJournal && !isApprox) {
      deadlines_journals.push(data[i]);
    } else if(!isJournal && isApprox) {
      deadlines_conferences_approx.push(data[i]);
    } else {
      deadlines_conferences.push(data[i]);
    }
  }

  // Sort all arrays
  deadlines_conferences.sort(function(a,b) {
    return a.deadline.getTime() - b.deadline.getTime();
  });
  deadlines_conferences_approx.sort(function(a,b) {
    return a.deadline.getTime() - b.deadline.getTime();
  });
  deadlines_journals.sort(function(a,b) {
    return a.deadline.getTime() - b.deadline.getTime();
  });
  deadlines_journals_approx.sort(function(a,b) {
    return a.deadline.getTime() - b.deadline.getTime();
  });
});

// Friday, March 1st, 11:59pm UTC
//deadlines.push({venue: "UAI", area: "Machine Learning", deadline: new Date("Friday, March 1st, 11:59pm UTC"), approx: 1});
// Mar. 15, 2013
//deadlines.push({venue: "IROS", area: "Robotics", deadline: new Date(2014, 2, 15, 23, 59, 0, 0)});

// Display function, called every second or so
function refreshDisplay() {

    var dc = new Date();
    $("#currtime").text("Current time (Local): " + dc);

    // Update conferences
    for(var i=0; i<deadlines_conferences.length; i++) {
      refreshDeadline(i, deadlines_conferences[i], dc, 'conference', false);
    }
    for(var i=0; i<deadlines_conferences_approx.length; i++) {
      refreshDeadline(i, deadlines_conferences_approx[i], dc, 'conference', true);
    }

    // Update journals
    for(var i=0; i<deadlines_journals.length; i++) {
      refreshDeadline(i, deadlines_journals[i], dc, 'journal', false);
    }
    for(var i=0; i<deadlines_journals_approx.length; i++) {
      refreshDeadline(i, deadlines_journals_approx[i], dc, 'journal', true);
    }

}

function refreshDeadline(i, dl, dc, type, isApprox){

  var suffix = ""
  var warningString = "";
  if(isApprox) {
    warningString = "based on previous year!";
    suffix = "_approx"
  }

  // Add type to suffix for unique IDs
  suffix = "_" + type + suffix;  // e.g., "_conference", "_journal_approx"

  // Handle rolling submission journals
  var timeLeft;
  var timeDisplay;
  if (dl.rolling) {
    timeDisplay = "Rolling";
    timeLeft = new Date(0); // No countdown for rolling submissions
  } else {
    timeLeft = new Date(dl.deadline.getTime() - dc.getTime());
    timeDisplay = timeLeftDescription(timeLeft);
  }

  // Add ranking badge
  var rankingBadge = "";
  if ("ranking" in dl && dl.ranking) {
    var rankingClass = "rank-" + dl.ranking.toLowerCase().replace(/\*/g, 'star').replace(/\s+/g, '-');
    rankingBadge = "<span class=\"ranking-badge " + rankingClass + "\">" + dl.ranking + "</span> ";
  }

  var venue = dl.venue;

  if ("location" in dl)
    venue = venue + "  (" + dl.location + ")";

  if ("link" in dl)
    venue = "<span class=\"vld\" id=\"link"+suffix+i+"\">" + venue + "</span>";

  var venueLong;
  if ("venue_long" in dl) {
    venueLong = "<div class=\"ad\">" + dl.venue_long + "</div>";
  } else {
    venueLong = "";
  }

  var area;
  if("area" in dl) {
    area = "<div class=\"ad\">" + dl.area + "</div>";
  } else {
    area = "";
  }

  var conferenceDates;
  if ("conference_dates" in dl) {
    conferenceDates =
      new Date(dl.conference_dates.start).toDateString().slice(0, -5) + " to "
      + new Date(dl.conference_dates.end).toDateString();
  } else {
    conferenceDates = "Not known";
  }

  var abstractDeadline;
  if ("abstract_deadline" in dl) {
    abstractDeadline = "<div class=\"td\"> Abstracts: " + convertAoeToLocal(dl.abstract_deadline).toString() + "</div>"
  } else {
    abstractDeadline = "";
  }

  var format;
  if ("format" in dl) {
    format = "<div class=\"cd\"> Format: " + dl.format + "</div>"
  } else {
    format = "";
  }

  var cameraReady;
  if ("camera_ready" in dl) {
    cameraReady = "<div class=\"td\"> Camera Ready: " + new Date(dl.camera_ready).toDateString() + "</div>"
  } else {
    cameraReady = "";
  }

  var notification;
  if ("notification" in dl) {
    notification = "<div class=\"td\"> Notification: " + new Date(dl.notification).toDateString() + "</div>"
  } else {
    notification = "";
  }


  // Build HTML based on whether it's a rolling journal or not
  var deadlineDisplay = dl.rolling
    ? "<div class=\"td\"> Submission: Rolling (Open Year-Round)</div>"
    : "<div class=\"td\"> Deadline: " + dl.deadline.toString() + "</div>";

  var conferenceDatesDisplay = dl.rolling
    ? ""
    : "<div class=\"cd\"> Conference Dates: " + conferenceDates + "</div>";

  $("#deadline" + suffix + i).html(
    "<div class=\"tld\">" + timeDisplay + "</div>"
  + "<div class=\"vd\">" + rankingBadge + venue + "</div>"
  + venueLong
  + area
  + abstractDeadline
  + deadlineDisplay
  + notification
  + cameraReady
  + conferenceDatesDisplay
  + format
  + "<div class=\"wd\">" + warningString + "</div>"
  + "<div class=\"hd\" id=\"hide"+suffix+i+"\">hide</div>"
  );
  var hid = "#hide"+suffix+i;
  var did = "#deadline"+suffix+i;
  $(hid).click(function(x) {
    return function() {
      $(x).hide();
      return false;
    }
  }(did));

  var linkid = "#link"+suffix+i;
  $(linkid).click(function(x) {
    return function() {
      window.open(x);
      return false;
    }
  }(dl.link));

  if(backi !== -1) {
    var dl;
    if(backtype === 'conference') {
      dl = backapprox ? deadlines_conferences_approx[backi] : deadlines_conferences[backi];
    } else {
      dl = backapprox ? deadlines_journals_approx[backi] : deadlines_journals[backi];
    }

    var venue = dl.venue;
    if("link" in dl)
      venue = "<span class=\"vld\" id=\"link"+suffix+i+"\">" + venue + "</span>";
    var timeLeft= new Date(dl.deadline.getTime() - dc.getTime());
    $("#backfacetext").html(
      venue + "</br>"
      + timeLeftDescription(timeLeft)
      );

    var linkid = "#link"+suffix+i;
    $(linkid).click(function(x) {
      return function() {
        window.open(x);
        return false;
      }
    }(dl.link));
  }
}

// int main(){}
$(document).ready(function() {

  // CONFERENCES SECTION
  $("<h2 class='section-header'>Conferences</h2>").appendTo("div#deadlinesdiv");

  // Confirmed conference deadlines
  for(var i=0; i<deadlines_conferences.length; i++) {
    var dl = deadlines_conferences[i];
    $("<div class='dd' id='deadline_conference" + i + "'></div>").appendTo("div#deadlinesdiv");
    var divid = "#deadline_conference" + i;

    $(divid).hide();
    $(divid).fadeIn(200*(i+1), function() { });

    $(divid).click(function(z, type, isApprox) {
      return function() {
        backi = z;
        backtype = type;
        backapprox = isApprox;
        $("#backface").fadeIn("slow");
      }
    }(i, 'conference', false));
  }

  // Approximate conference deadlines
  for(var i=0; i<deadlines_conferences_approx.length; i++) {
    var dl = deadlines_conferences_approx[i];
    $("<div class='dd' id='deadline_conference_approx" + i + "'></div>").appendTo("div#deadlinesdiv");
    var divid = "#deadline_conference_approx" + i;

    $(divid).hide();
    $(divid).fadeIn(200*(i+1), function() { });

    $(divid).click(function(z, type, isApprox) {
      return function() {
        backi = z;
        backtype = type;
        backapprox = isApprox;
        $("#backface").fadeIn("slow");
      }
    }(i, 'conference', true));
  }

  // JOURNALS SECTION
  $("<h2 class='section-header'>Journals</h2>").appendTo("div#deadlinesdiv");

  // Confirmed journal deadlines
  for(var i=0; i<deadlines_journals.length; i++) {
    var dl = deadlines_journals[i];
    $("<div class='dd' id='deadline_journal" + i + "'></div>").appendTo("div#deadlinesdiv");
    var divid = "#deadline_journal" + i;

    $(divid).hide();
    $(divid).fadeIn(200*(i+1), function() { });

    $(divid).click(function(z, type, isApprox) {
      return function() {
        backi = z;
        backtype = type;
        backapprox = isApprox;
        $("#backface").fadeIn("slow");
      }
    }(i, 'journal', false));
  }

  // Approximate journal deadlines
  for(var i=0; i<deadlines_journals_approx.length; i++) {
    var dl = deadlines_journals_approx[i];
    $("<div class='dd' id='deadline_journal_approx" + i + "'></div>").appendTo("div#deadlinesdiv");
    var divid = "#deadline_journal_approx" + i;

    $(divid).hide();
    $(divid).fadeIn(200*(i+1), function() { });

    $(divid).click(function(z, type, isApprox) {
      return function() {
        backi = z;
        backtype = type;
        backapprox = isApprox;
        $("#backface").fadeIn("slow");
      }
    }(i, 'journal', true));
  }

  // set up deadline timer to redraw
  setInterval(
    function(){ refreshDisplay(); },
    1000
  );

  $("#backface").click(function() {
    backi = -1;
    $("#backface").fadeOut("slow");
  });

  $("#makeown").click(function() {
    backi = -1;
    $("#instrown").fadeToggle();
  });

  // draw!
  refreshDisplay();

});
