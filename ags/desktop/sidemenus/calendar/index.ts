import { VBox } from 'widgets'
import MenuRevealer from '../MenuRevealer'

import Header, { calendarJson } from './Header'

const weekDays = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]

const CalendarDay = (day, today) => Widget.Button({
  hpack: 'center',
  label: String(day),
  className: `calendar-btn ${
    (today === 1)
      ? 'calendar-btn-today'
      : (today === -1)
        ? 'calendar-btn-othermonth' : '' }`,
})

export function addCalendarChildren(box, calendarJson) {
  const children = box.get_children()
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    child.destroy()
  }
  box.children = calendarJson.map(row => Widget.Box({
    children: row.map(day => CalendarDay(day.day, day.today)),
  }))
}

export const CalendarDays = VBox({
  hexpand: true,
  hpack: 'center',
  className: 'body',
  setup(self: typeof Widget.Box) {
    addCalendarChildren(self, calendarJson)
  }
})

export default MenuRevealer('calendar',
  Header,
  Widget.Box({
    hexpand: true,
    hpack: 'center',
    className: 'weekdays',
    children: weekDays.map(day => CalendarDay(day, 0))
  }),
  CalendarDays
)
