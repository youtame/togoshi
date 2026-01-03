import { isHoliday } from 'japanese-holidays';

type DateInput = Date | string | undefined;

const Manual_holiday = [
    '2025-12-30',
    '2025-12-31',
    '2026-01-01',
    '2026-01-02',
    '2026-01-03',
];

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

    // Railway specific holiday dates
    if (Manual_holiday.includes(ymd)) {
        return 'odpt.Calendar:SaturdayHoliday';
    }

    // Saturday or Sunday
    if (day === 0 || day === 6) {
        return 'odpt.Calendar:SaturdayHoliday';
    }

    // Japananse national holiday
    if (isHoliday(date)) {
        return 'odpt.Calendar:SaturdayHoliday';
    }
    // Weekday
    return 'odpt.Calendar:Weekday';
}

console.log(getCalendar());
