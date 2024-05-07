import { type Binding } from 'lib/utils'
import nix from 'service/nix'

import * as ShRun from './ShRun'
import * as NixRun from './NixRun'
import * as AppLauncher from './AppLauncher'
import RevealerWindow, { Padding } from 'windows/RevealerWindow'

import options from 'options'

const { width, margin } = options.launcher
const isnix = nix.available

function Launcher() {
  const favs = AppLauncher.Favorites()
  const applauncher = AppLauncher.Launcher()
  const sh = ShRun.ShRun()
  const shicon = ShRun.Icon()
  const nix = NixRun.NixRun()
  const nixload = NixRun.Spinner()

  const HelpButton = (cmd: string, desc: string | Binding<string>) => Widget.Box(
    { vertical: true },
    Widget.Separator(),
    Widget.Button(
      {
        className: 'help',
        onClicked() {
          entry.grab_focus()
          entry.text = `:${cmd} `
          entry.set_position(-1)
        },
      },
      Widget.Box([
        Widget.Label({ className: 'name', label: `:${cmd}` }),
        Widget.Label({
          label: desc,
          hpack: 'end',
          hexpand: true,
          className: 'description',
        }),
      ]),
    ),
  )

  const help = Widget.Revealer({
    child: Widget.Box(
      { vertical: true },
      HelpButton('sh', 'run a binary'),
      isnix ? HelpButton('nx', options.launcher.nix.pkgs.bind().as(pkg =>
        `run a nix package from ${pkg}`,
      )) : Widget.Box(),
    ),
  })

  const entry = Widget.Entry({
    hexpand: true,
    onAccept({ text }) {
      if (text?.startsWith(':nx'))
        nix.run(text.substring(3))
      else if (text?.startsWith(':sh'))
        sh.run(text.substring(3))
      else
        applauncher.launchFirst()

      App.toggleWindow('launcher')
      entry.text = ''
    },
    onChange({ text }) {
      text ||= ''
      favs.revealChild = text === ''
      help.revealChild = text.split(' ').length === 1 && text?.startsWith(':')

      if (text?.startsWith(':nx'))
        nix.filter(text.substring(3))
      else nix.filter('')

      if (text?.startsWith(':sh'))
        sh.filter(text.substring(3))
      else sh.filter('')

      if (!text?.startsWith(':'))
        applauncher.filter(text)
    },
  })

  function focus() {
    entry.text = 'Search'
    entry.set_position(-1)
    entry.select_region(0, -1)
    entry.grab_focus()
    favs.revealChild = true
  }

  const layout = Widget.Box({
    vpack: 'start',
    vertical: true,
    className: 'launcher',
    css: width.bind().as(v => `min-width: ${v}pt;`),
    children: [
      Widget.Box([entry, nixload, shicon]),
      favs,
      help,
      applauncher,
      nix,
      sh,
    ],
  }).hook(App, (self, win, visible) => {
    if (win !== 'launcher') return

    entry.text = ''
    if (visible) focus()
  })

  return Widget.Box(
    { vertical: true, css: 'padding: 1px;' },
    Padding('applauncher', {
      vexpand: false,
      css: margin.bind().as(v => `min-height: ${v}pt;`),
    }),
    layout,
  )
}

export default RevealerWindow({
  layout: 'top',
  name: 'launcher',
  child: Launcher(),
})
