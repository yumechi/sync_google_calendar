import { CalendarUtil, envProperty } from './util';

function run_scripts() {
  const privateCalendarName: string = envProperty("PRIVATE_CALENDAR");
  const public_calender_name: string = envProperty("PUBLIC_CALENDAR");
  const secret_words: string[] = ["secret", "秘密の"];

  const private_calendar = CalendarUtil.getCalendar(privateCalendarName);
  const public_calendar = CalendarUtil.getCalendar(public_calender_name);
  Logger.log(private_calendar.getName());
  Logger.log(public_calendar.getName());

  const events = get_events(private_calendar, 1);

  for (const idx in events) {
    event = events[idx];
    const public_word = "【yumechi】";
    
    function is_open_public(event) {
      return endsWith(event.getTitle(), public_word);
    }
    
    function get_title(event) {
      const title = event.getTitle();
      for (const i in secret_words) {
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
        
        const description = event.getDescription();
        for (const i in secret_words) {
          if(startsWith(description, secret_words[i])) {
            return secret_description;
          }
        }
        return description;
    }

    if(is_open_public(event)) {
      continue;
    }

    const title = get_title(event);
    const option = {
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

function startsWith(stringItem, word) {
  return stringItem.indexOf(word) === 0; 
}

function endsWith(stringItem, word) {
  return ((stringItem.lastIndexOf(word) + word.length) === stringItem.length)
         && (word.length <= stringItem.length);
}

function get_events(calender, diff) {
  const today = new Date();
  const end_date = new Date();
  end_date.setMonth(end_date.getMonth() + diff);
  // debug
  // end_date.setDate(end_date.getDate() + 1);
  return calender.getEvents(today, end_date);
}
