import { CalendarUtil, envProperty } from './util';

function run_scripts() {
  const privateCalendarName: string = envProperty('PRIVATE_CALENDAR');
  const publicCalenderName: string = envProperty('PUBLIC_CALENDAR');
  const secretWords: string[] = ['secret', '秘密の'];

  const privateCalendar = CalendarUtil.getCalendar(privateCalendarName);
  const publicCalendar = CalendarUtil.getCalendar(publicCalenderName);
  Logger.log(privateCalendar.getName());
  Logger.log(publicCalendar.getName());

  const events = getEvents(privateCalendar, 1);

  for (const idx of Object.keys(events)) {
    event = events[idx];
    const publicWord = '【yumechi】';

    function isOpenPublic(event) {
      return endsWith(event.getTitle(), publicWord);
    }

    function getTitle(event) {
      const title = event.getTitle();
      for (const i in secretWords) {
        if (startsWith(title, secretWords[i])) {
          return '予定あり';
        }
      }
      return title;
    }

    function getDescription(event, title) {
      const secretDescription = 'この予定は非公開です';
      if (title === '予定あり') {
        return secretDescription;
      }

      const description = event.getDescription();
      for (const i in secretWords) {
        if (startsWith(description, secretWords[i])) {
          return secretDescription;
        }
      }
      return description;
    }

    if (isOpenPublic(event)) {
      continue;
    }

    const title = getTitle(event);
    const option = {
      description: getDescription(event, title),
    };

    publicCalendar.createEvent(
      title,
      event.getStartTime(),
      event.getEndTime(),
      option
    );
    // FIXME: remove original calendar event and recreate calendar event of replaced title
    event.setTitle(event.getTitle() + ' ' + publicWord);
    Logger.log('-------------------------');
    Logger.log(title);
    Logger.log(event.getStartTime());
    Logger.log(event.getEndTime());
    Logger.log(option['description']);
    Logger.log('-------------------------');
  }
}

function startsWith(stringItem, word) {
  return stringItem.indexOf(word) === 0;
}

function endsWith(stringItem, word) {
  return (
    stringItem.lastIndexOf(word) + word.length === stringItem.length &&
    word.length <= stringItem.length
  );
}

function getEvents(calender, diff) {
  const today = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + diff);
  // debug
  // end_date.setDate(end_date.getDate() + 1);
  return calender.getEvents(today, endDate);
}
