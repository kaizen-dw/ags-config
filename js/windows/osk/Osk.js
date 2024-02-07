const { Gtk } = imports.gi

const { execAsync } = Utils
import { utils, oskLayouts } from '../../constants/main.js'
import { setupCursorHoverGrab } from '../../misc/CursorHover.js'
// import { defaultOskLayout, oskLayouts } from '../../data/keyboardlayouts.js'

const keyboardLayout = 'qwerty_full'
const keyboardJson = oskLayouts[keyboardLayout]
execAsync('ydotoold').catch(print) // Start ydotool daemon

function releaseAllKeys() {
  const keycodes = Array.from(Array(249).keys())
  execAsync([`ydotool`, `key`, ...keycodes.map(keycode => `${keycode}:0`)])
    .then(console.log('[OSK] Released all keys')).catch(print)
}

class ShiftMode {
  static Off = new ShiftMode('Off')
  static Normal = new ShiftMode('Normal')
  static Locked = new ShiftMode('Locked')

  constructor(name) {
    this.name = name
  }
  toString() { return `ShiftMode.${this.name}` }
}
let modsPressed = false

const topDecor = Widget.Box({
  vertical: true,
  children: [
    Widget.Box({
      hpack: 'center',
      className: 'osk-dragline',
      homogeneous: true,
      children: [ Widget.EventBox({ setup: setupCursorHoverGrab })]
    })
  ]
});

const keyboardControlButton = (icon, text, runFunction) => Widget.Button({
  className: 'osk-control-button spacing-h-10',
  onClicked: () => runFunction(),
  child: Widget.Box({
    children: [
      Widget.Label({ label: icon, className: 'norm' }),
      Widget.Label({ label: `${text}` }),
    ]
  })
})

const keyboardControls = Widget.Box({
  vertical: true,
  className: 'spacing-v-5',
  children: [
    Widget.Button({
      label: '󰌏',
      className: 'osk-control-button txt-norm',
      onClicked: () => {
        releaseAllKeys()
        App.toggleWindow('osk')
      },
    }),
    Widget.Button({
      label: `${keyboardJson['name_short']}`,
      className: 'osk-control-button txt-norm',
    }),
    Widget.Button({
      className: 'osk-control-button txt-norm icon-material',
      onClicked: () => {
        utils.execBash('pkill fuzzel || cliphist list | fuzzel --no-fuzzy --dmenu | cliphist decode | wl-copy').catch(print)
      },
      label: 'assignment',
    }),
  ]
})

let shiftMode = ShiftMode.Off
let shiftButton
let  rightShiftButton
let allButtons = []
const keyboardItself = kbJson => Widget.Box({
  vertical: true,
  className: 'spacing-v-5',
  children: kbJson.keys.map(row => Widget.Box({
    vertical: false,
    className: 'spacing-h-5',
    children: row.map(key => {
      return Widget.Button({
        className: `osk-key osk-key-${key.shape}`,
        hexpand: ['space', 'expand'].includes(key.shape),
        label: key.label,
        attribute: { key },
        setup: button => {
          let pressed = false
          allButtons = allButtons.concat(button)
          if (key.keytype == 'normal') {
            button.connect('pressed', () => execAsync(`ydotool key ${key.keycode}:1`))
            button.connect('clicked', () => { // release
              execAsync(`ydotool key ${key.keycode}:0`)

              if (shiftMode == ShiftMode.Normal) {
                shiftMode = ShiftMode.Off
                if (typeof shiftButton !== 'undefined') {
                  execAsync(`ydotool key 42:0`);
                  shiftButton.toggleClassName('osk-key-active', false);
                }
                if (typeof rightShiftButton !== 'undefined') {
                  execAsync(`ydotool key 54:0`);
                  rightShiftButton.toggleClassName('osk-key-active', false);
                }
                allButtons.forEach(button => {
                  if (typeof button.attribute.key.labelShift !== 'undefined') 
                    button.label = button.attribute.key.label
                })
              }
            })
          } else if (key.keytype == 'modkey') {
            button.connect('pressed', () => { // release
              if (pressed) {
                execAsync(`ydotool key ${key.keycode}:0`);
                button.toggleClassName('osk-key-active', false);
                pressed = false;
                if (key.keycode == 100) { // Alt Gr button
                  allButtons.forEach(btn => { 
                    if (typeof btn.attribute.key.labelAlt !== 'undefined') 
                      btn.label = btn.attribute.key.label
                  })
                }
              }
              else {
                execAsync(`ydotool key ${key.keycode}:1`);
                button.toggleClassName('osk-key-active', true);
                if (!(key.keycode == 42 || key.keycode == 54)) pressed = true;
                else switch (shiftMode.name) { // This toggles the shift button state
                  case 'Off':
                    shiftMode = ShiftMode.Normal
                    allButtons.forEach(btn => { 
                      if (typeof btn.attribute.key.labelShift !== 'undefined') 
                        btn.label = btn.attribute.key.labelShift
                    })

                    if (typeof shiftButton !== 'undefined')
                      shiftButton.toggleClassName('osk-key-active', true)
                    if (typeof rightShiftButton !== 'undefined')
                      rightShiftButton.toggleClassName('osk-key-active', true)
                    break

                  case 'Normal':
                    shiftMode = ShiftMode.Locked
                    if (typeof shiftButton !== 'undefined') 
                      shiftButton.label = key.labelCaps
                    if (typeof rightShiftButton !== 'undefined') 
                      rightShiftButton.label = key.labelCaps
                    break

                  case 'Locked': {
                    shiftMode = ShiftMode.Off
                    if (typeof shiftButton !== 'undefined') {
                      shiftButton.label = key.label
                      shiftButton.toggleClassName('osk-key-active', false)
                    }
                    if (typeof rightShiftButton !== 'undefined') {
                      rightShiftButton.label = key.label
                      rightShiftButton.toggleClassName('osk-key-active', false)
                    }
                    execAsync(`ydotool key ${key.keycode}:0`)
                    
                    allButtons.forEach(btn => { 
                      if (typeof btn.attribute.key.labelShift !== 'undefined') 
                        btn.label = btn.attribute.key.label
                    })
                  }
                }

                if (key.keycode == 100) { // Alt Gr button
                  allButtons.forEach(btn => { 
                    if (typeof btn.attribute.key.labelAlt !== 'undefined') 
                      btn.label = btn.attribute.key.labelAlt
                  })
                }
                modsPressed = true
              }
            })
            if (key.keycode == 42) 
              shiftButton = button
            else if (key.keycode == 54) 
              rightShiftButton = button
          }
        }
      })
    })
  }))
})

const keyboardWindow = Widget.Box({
  vexpand: true,
  hexpand: true,
  vertical: true,
  className: 'osk-window spacing-v-5',
  children: [
    topDecor,
    Widget.Box({
      className: 'osk-body spacing-h-10',
      children: [
        keyboardControls,
        Widget.Box({ className: 'separator-line' }),
        keyboardItself(keyboardJson),
      ],
    })
  ],
  setup: self => self.hook(App, (_, name, visible) => { // Update on open
    if (name == 'osk' && visible)
      keyboardWindow.setCss(`margin-bottom: -0px;`)
  }),
})

const gestureEvBox = Widget.EventBox({ child: keyboardWindow })
const gesture = Gtk.GestureDrag.new(gestureEvBox)
gesture.connect('drag-begin', async () => {
  try {
    const Hyprland = (await import('resource:///com/github/Aylur/ags/service/hyprland.js')).default
    Hyprland.sendMessage('j/cursorpos').then((out) => {
      gesture.startY = JSON.parse(out).y
    }).catch(print)
  } catch { return }
})

gesture.connect('drag-update', async () => {
  try {
    const Hyprland = (await import('resource:///com/github/Aylur/ags/service/hyprland.js')).default;
    Hyprland.sendMessage('j/cursorpos').then(out => {
      const currentY = JSON.parse(out).y
      const offset = gesture.startY - currentY

      if (offset > 0) return

      keyboardWindow.setCss('margin-bottom: ${offset}px;')
    }).catch(print)
  } catch { return }
})

gesture.connect('drag-end', () => {
  const offset = gesture.get_offset()[2]
  if (offset > 50)
    App.closeWindow('osk')
  else keyboardWindow.setCss(`
      transition: margin-bottom 170ms cubic-bezier(0.05, 0.7, 0.1, 1);
      margin-bottom: 0;`)
})

export default gestureEvBox
