import icons from 'data/icons'
import sh from 'service/sh'

const iconVisible = Variable(false)

function Item(bin: string) {
  return Widget.Box(
    {
      vertical: true,
      attribute: { bin },
    },
    Widget.Separator(),
    Widget.Button({
      child: Widget.Label({ label: bin, hpack: 'start' }),
      className: 'sh-item',
      onClicked() {
        Utils.execAsync(bin)
        App.closeWindow('launcher')
      },
    }),
  )
}

export const Icon = () => Widget.Revealer({
  child: Widget.Icon({
    className: 'spinner',
    icon: icons.app.terminal,
  }),
  transition: 'slide_left',
  revealChild: iconVisible.bind(),
})

export function ShRun() {
  const list = Widget.Box<ReturnType<typeof Item>>({ vertical: true })
  const revealer = Widget.Revealer({ child: list })

  async function filter(term: string) {
    iconVisible.value = Boolean(term)

    if (!term)
      revealer.revealChild = false

    if (term.trim()) {
      const found = await sh.query(term)
      list.children = found.map(Item)
      revealer.revealChild = true
    }
  }

  return Object.assign(revealer, { filter, run: sh.run, })
}
