import { CalendarUtil, envProperty } from './util';
import './string.extensions';

const SEARCH_RANGE = 1;

function main(): void {
  const privateCalendarName: string = envProperty('PRIVATE_CALENDAR');
  const publicCalenderName: string = envProperty('PUBLIC_CALENDAR');
  const secretWords: string[] = ['secret', '秘密の'];

  const privateCalendar: GoogleAppsScript.Calendar.Calendar = CalendarUtil.getCalendar(
    privateCalendarName
  );
  const publicCalendar: GoogleAppsScript.Calendar.Calendar = CalendarUtil.getCalendar(
    publicCalenderName
  );
  Logger.log(privateCalendar.getName());
  Logger.log(publicCalendar.getName());

  const events: GoogleAppsScript.Calendar.CalendarEvent[] = getEvents(
    privateCalendar,
    SEARCH_RANGE
  );

  for (const calendarKey of Object.keys(events)) {
    const event: GoogleAppsScript.Calendar.CalendarEvent = events[calendarKey];
    const publicWord = '【yumechi】';

    const isOpenPublic: Function = (
      event: GoogleAppsScript.Calendar.CalendarEvent
    ): boolean => {
      return event.getTitle().endsWith(publicWord);
    };

    const getTitle: Function = (
      event: GoogleAppsScript.Calendar.CalendarEvent
    ): string => {
      const title: string = event.getTitle();
      for (const i in secretWords) {
        if (title.startsWith(secretWords[i])) {
          return '予定あり';
        }
      }
      return title;
    };

    const getDescription: Function = (
      event: GoogleAppsScript.Calendar.CalendarEvent,
      title: string
    ): string => {
      const secretDescription = 'この予定は非公開です';
      if (title === '予定あり') {
        return secretDescription;
      }

      const description: string = event.getDescription();
      for (const i in secretWords) {
        if (description.startsWith(secretWords[i])) {
          return secretDescription;
        }
      }
      return description;
    };

    if (isOpenPublic(event)) {
      continue;
    }

    const title: string = getTitle(event);
    const option: {} = {
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
    Logger.log(`-------------------------
${title}
${event.getStartTime()}
${event.getEndTime()}
${option['description']}
-------------------------`);
  }
}

function getEvents(
  calender: GoogleAppsScript.Calendar.Calendar,
  diff: number
): GoogleAppsScript.Calendar.CalendarEvent[] {
  const today = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + diff);
  // debug
  // end_date.setDate(end_date.getDate() + 1);
  return calender.getEvents(today, endDate);
}
