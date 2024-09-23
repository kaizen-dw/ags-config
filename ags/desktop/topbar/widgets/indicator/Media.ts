import { type BoxProps } from 'types/widgets/box'
import { type IconProps } from 'types/widgets/icon'
import { type MprisProps } from 'types/service/mpris'
import { type EventBoxProps } from 'types/widgets/eventbox'

import { Cava, CircularProgressIcon } from 'widgets'
import PlayerMenu from 'desktop/dropdowns/player'

import icons from 'data/icons'
import options from 'options'
import { sh } from 'lib/utils'

const { Box, EventBox, Label } = Widget

const mpris = await Service.import('mpris')

const TITLE_LENGTH = 32
const { smooth, length } = options.topbar.player.visualizer
const getPlayer = () => mpris.getPlayer('spotify') || null

function getLabel(player: MprisProps) {
  if (player) {
    const artists = player['track-artists'].join(', ')
    const label = `${artists && artists} - ${player['track_title']}`
    return label.substring(0, TITLE_LENGTH)
  } else return ''
}

export const playing = EventBox({
  child: Box({ hpack: 'center' }),
  onScrollDown(self: EventBoxProps) { self.parent.shown = 'visualizer' },
}).hook(mpris, (self: BoxProps) => {
  const player = getPlayer()
  if (!player) return

  const label = getLabel(player)

  self.tooltipText = label
  self.onPrimaryClick = player.playPause
  self.onSecondaryClick = (_, event) => PlayerMenu(event, player)
  self.child.children = [
    CircularProgressIcon(
      { className: 'progress' },
      icons.mpris[player['play-back-status'].toLowerCase()]
    ).poll(1000, (self: IconProps) => self.value = player.position / player.length),
    Label(label)
  ]
})

export const visualizer = EventBox({
  attribute: {
    update(self: BoxProps) {
      const width = 8, height = 24
      const player = getPlayer()
      if (!player) return

      sh('pkill cava') // INFO: Avoids multiple instance of cava

      const label = getLabel(player)
      const size = Math.round(label.length * 0.9)
      const bars = {
        long: 256, normal: 128, short: 64,
        auto: (size < TITLE_LENGTH ? size : TITLE_LENGTH) * width
      }

      self.tooltipText = label
      self.child.child = Cava({
        width, height,
        smooth: smooth.value,
        bars: bars[length.value],
      })
      self.onPrimaryClick = player.playPause
      self.onSecondaryClick = (_, event) => PlayerMenu(event, player)
    }
  },
  onScrollUp(self: EventBoxProps) { self.parent.shown = 'playing' },
  child: Box({ hpack: 'center', className: 'visualizer' })
})
  .hook(mpris, (self: BoxProps) => self.attribute.update(self))
  .hook(length, (self: BoxProps) => self.attribute.update(self))
  .hook(smooth, (self: BoxProps) => self.attribute.update(self))
