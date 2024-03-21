import Row from './Row'
import Group from './Group'
import Page from './Page'
import options from 'options'
import icons from 'data/icons'

const {
  wallpaper: wp,
  autotheme: at,
  font,
  theme,
  // media,
  // bar: b,
  // launcher: al,
  // overview: ov,
  // powermenu: pm,
  // dropmenu,
  // indicators,
  // hyprland: h,
} = options

const {
  dark,
  light,
  blur,
  scheme,
  padding,
  spacing,
  radius,
  shadows,
  widget,
  border,
} = theme

export default [
  Page('Theme', icons.ui.themes,
    Group('',
      Row({ opt: wp, title: 'Wallpaper', type: 'img' }),
      Row({ opt: at, title: 'Auto Generate Color Scheme' }),
      Row({ opt: scheme, title: 'Color Scheme', type: 'enum', enums: ['dark', 'light'] }),
      Row({ opt: blur, title: 'Blur', note: '0 to disable', max: 70 }),
    ),
    Group('Dark Colors',
      Row({ opt: dark.bg, title: 'Background', type: 'color' }),
      Row({ opt: dark.fg, title: 'Foreground', type: 'color' }),
      Row({ opt: dark.primary.bg, title: 'Primary', type: 'color' }),
      Row({ opt: dark.primary.fg, title: 'On Primary', type: 'color' }),
      Row({ opt: dark.error.bg, title: 'Error', type: 'color' }),
      Row({ opt: dark.error.fg, title: 'On Error', type: 'color' }),
      Row({ opt: dark.widget, title: 'Widget', type: 'color' }),
      Row({ opt: dark.border, title: 'Border', type: 'color' }),
    ),
    Group('Light Colors',
      Row({ opt: light.bg, title: 'Background', type: 'color' }),
      Row({ opt: light.fg, title: 'Foreground', type: 'color' }),
      Row({ opt: light.primary.bg, title: 'Primary', type: 'color' }),
      Row({ opt: light.primary.fg, title: 'On Primary', type: 'color' }),
      Row({ opt: light.error.bg, title: 'Error', type: 'color' }),
      Row({ opt: light.error.fg, title: 'On Error', type: 'color' }),
      Row({ opt: light.widget, title: 'Widget', type: 'color' }),
      Row({ opt: light.border, title: 'Border', type: 'color' }),
    ),
    Group('Theme',
      Row({ opt: shadows, title: 'Shadows' }),
      Row({ opt: widget.opacity, title: 'Widget Opacity', max: 100 }),
      Row({ opt: border.opacity, title: 'Border Opacity', max: 100 }),
      Row({ opt: border.width, title: 'Border Width' }),
    ),
    Group('UI',
      Row({ opt: padding, title: 'Padding' }),
      Row({ opt: spacing, title: 'Spacing' }),
      Row({ opt: radius, title: 'Roundness' }),
      Row({ opt: font.default.size, title: 'Font Size' }),
      Row({ opt: font.default.name, title: 'Font Name', type: 'font' }),
    ),
  ),
  // Page('Bar', icons.ui.toolbars,
  //   Group('Launcher',
  //     Row({ opt: b.launcher.icon.icon, title: 'Icon' }),
  //     Row({ opt: b.launcher.icon.colored, title: 'Colored Icon' }),
  //     Row({ opt: b.launcher.label.label, title: 'Label' }),
  //     Row({ opt: b.launcher.label.colored, title: 'Colored Label' }),
  //   ),
  //   Group('Workspaces',
  //     Row({ opt: b.workspaces.workspaces, title: 'Number of Workspaces', note: '0 to make it dynamic' }),
  //   ),
  //   Group('Taskbar',
  //     Row({ opt: b.taskbar.monochrome, title: 'Monochrome' }),
  //     Row({ opt: b.taskbar.exclusive, title: 'Exclusive to workspaces' }),
  //   ),
  //   Group('Datemenu',
  //     Row({ opt: b.datemenu.format, title: 'Date Format' }),
  //   ),
  //   Group('Media',
  //     Row({ opt: b.media.length, title: 'Length' }),
  //     // Row({ opt: media.preferred, title: 'Preferred' }),
  //     // Row({ opt: media.coverSize, title: 'Cover size' }),
  //     // Row({ opt: media.position, title: 'Position', type: 'enum', enums: [ 'left', 'right', 'center' ] }),
  //   ),
  //   Group('Powermenu',
  //     Row({ opt: b.powermenu.monochrome, title: 'Monochrome' }),
  //   ),
  // ),
  // Page('Menu',icons.ui.menu,
  //   Group('Dashboard',
  //     Row({ opt: dropmenu.dashboard.avatar.image, title: 'Avatar', type: 'img' }),
  //     Row({ opt: dropmenu.dashboard.avatar.size, title: 'Avatar Size' }),
  //   )
  // ),
  // Page('General', icons.ui.settings,
  //   Group('Hyprland',
  //     Row({ opt: h.gapsWhenOnly, title: 'Gaps When Only' }),
  //   ),
  //   Group('Applauncher',
  //     Row({ opt: al.iconSize, title: 'Icon Size' }),
  //     Row({ opt: al.width, title: 'Width' }),
  //     Row({ opt: al.maxItem, title: 'Max Items' }),
  //   ),
  //   Group('Overview',
  //     Row({ opt: ov.scale, title: 'Scale', max: 100 }),
  //     Row({ opt: ov.workspaces, title: 'workspaces', max: 11, note: 'set this to 0 to make it dynamic' }),
  //     Row({ opt: ov.monochromeIcon, title: 'Monochrome Icons' }),
  //   ),
  //   Group('Powermenu',
  //     Row({ opt: pm.layout, title: 'Layout', type: 'enum', enums: [ 'box', 'line' ] }),
  //     Row({ opt: pm.labels, title: 'Show Labels' }),
  //   ),
  //   Group('Screen Indicator',
  //     Row({ opt: indicators.progress.vertical, title: 'Vertical' }),
  //     Row({ opt: indicators.progress.pack.h, title: 'Horizontal Alignment', type: 'enum', enums: [ 'start', 'center', 'end' ] }),
  //     Row({ opt: indicators.progress.pack.v, title: 'Vertical Alignment', type: 'enum', enums: [ 'start', 'center', 'end' ] }),
  //   ),
  // ),
] as const
