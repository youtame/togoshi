import { isHoliday } from 'japanese-holidays';

type DateInput = Date | string | undefined;

const Manual_holiday = [
    '2025-12-30',
    '2025-12-31',
    '2026-01-01',
    '2026-01-02',
    '2026-01-03',
];

function isHolidayOrWeekend(date: Date): boolean {
    const ymd = date.toISOString().slice(0, 10);
    const day = date.getDay();
    return (
        Manual_holiday.includes(ymd) ||
        day === 0 ||
        day === 6 ||
        isHoliday(date)
    );
}

export function getCalendar(dateInput?: DateInput): string {
    const date =
        dateInput instanceof Date
            ? dateInput
            : dateInput
              ? new Date(dateInput)
              : new Date();

    if (isNaN(date.getTime())) {
        console.warn('Invalid date input, fallback to Weekday');
        return 'odpt.Calendar:Weekday';
    }

    const ymd = date.toISOString().slice(0, 10);
    const day = date.getDay();
    const hour = date.getHours();

    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1);
    const yesterdayIsHoliday = isHolidayOrWeekend(yesterday);

    if (!yesterdayIsHoliday && hour < 2) {
        return 'odpt.Calendar:Weekday';
    }

    if (yesterdayIsHoliday && hour < 2) {
        return 'odpt.Calendar:SaturdayHoliday';
    }

    if (isHolidayOrWeekend(date)) {
        return 'odpt.Calendar:SaturdayHoliday';
    }

    return 'odpt.Calendar:Weekday';
}

console.log(getCalendar());
