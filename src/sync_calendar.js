function run_scripts() {
  const private_calendar_name = envProperty("PRIVATE_CALENDAR");
  const public_calender_name = envProperty("PUBLIC_CALENDAR");
  const secret_words = ["secret", "秘密の"];

  var private_calendar = get_single_calendar_by_name(private_calendar_name);
  var public_calendar = get_single_calendar_by_name(public_calender_name);
  Logger.log(private_calendar.getName());
  Logger.log(public_calendar.getName());

  var events = get_events(private_calendar, 1);

  for (var idx in events) {
    event = events[idx];
    const public_word = "【yumechi】";
    
    function is_open_public(event) {
      return endsWith(event.getTitle(), public_word);
    }
    
    function get_title(event) {
      var title = event.getTitle();
      for (var i in secret_words) {
        if(startsWith(title, secret_words[i])) {
           return "予定あり";
        }
      }
      return title;
    }
    
    function get_description(event, title) {      
        const secret_description = "この予定は非公開です";
        if(title === "予定あり") {
          return secret_description;
        }
        
        var description = event.getDescription();
        for (var i in secret_words) {
          if(startsWith(description, secret_words[i])) {
            return secret_description;
          }
        }
        return description;
    }

    if(is_open_public(event)) {
      continue;
    }

    var title = get_title(event);
    var option = {
      description: get_description(event, title),
    };
    
    public_calendar.createEvent(title,
                                event.getStartTime(),
                                event.getEndTime(), 
                                option);
    // FIXME: remove original calendar event and recreate calendar event of replaced title 
    event.setTitle(event.getTitle() + " " + public_word);
    Logger.log("-------------------------");
    Logger.log(title);
    Logger.log(event.getStartTime());
    Logger.log(event.getEndTime());
    Logger.log(option['description']);
    Logger.log("-------------------------");
  }
}

function envProperty(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

function startsWith(stringItem, word) {
  return stringItem.indexOf(word) === 0; 
}

function endsWith(stringItem, word) {
  return ((stringItem.lastIndexOf(word) + word.length) === stringItem.length)
         && (word.length <= stringItem.length);
}

function get_single_calendar_by_name(name) {
  return CalendarApp.getCalendarsByName(name)[0];
}

function get_events(calender, diff) {
  var today = new Date();
  var end_date = new Date();
  end_date.setMonth(end_date.getMonth() + diff);
  // debug
  // end_date.setDate(end_date.getDate() + 1);
  return calender.getEvents(today, end_date);
}
