export function formatDate(date: Date, format: string): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const dayShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  return format
    .replace('YYYY', String(year))
    .replace('MMMM', monthNames[month - 1])
    .replace('MMM', monthShort[month - 1])
    .replace('MM', String(month).padStart(2, '0'))
    .replace('M', String(month))
    .replace('DD', String(day).padStart(2, '0'))
    .replace('D', String(day))
    .replace('dddd', dayNames[d.getDay()])
    .replace('ddd', dayShort[d.getDay()])
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function getWeekDates(date: Date, startOnMonday = true): Date[] {
  const d = new Date(date)
  const day = d.getDay()
  const diff = startOnMonday ? (day === 0 ? -6 : 1 - day) : -day
  d.setDate(d.getDate() + diff)
  return Array.from({ length: 7 }, (_, i) => {
    const nd = new Date(d)
    nd.setDate(d.getDate() + i)
    return nd
  })
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}
