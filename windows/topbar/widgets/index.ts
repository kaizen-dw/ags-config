import media from './media'
import control from './control'
import workspaces from './workspaces'

import tray from './Tray'
import profile from './Profile'
import datemenu from './Datemenu'
import launcher from './Launcher'
import notifs from './Notifications'

// Command Revealers
import leftCommands from './commands/leftCommands'
import rightCommands from './commands/rightCommands'

export default {
  tray,
  media,
  notifs,
  profile,
  control,
  launcher,
  datemenu,
  workspaces,
  leftCommands,
  rightCommands,
  expander: () => Widget.Box({ expand: true })
}
