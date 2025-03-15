/** @type { import('@storybook/vue3').Preview } */
import { setup } from '@storybook/vue3'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  BiCalendarCheck,
  MdArrowback,
  BiPeople,
  BiListCheck,
  BiThreeDotsVertical,
  MdMenu,
  BiCalendarEvent,
  BiPatchCheckFill,
  BiClock,
  RiErrorWarningFill,
  BiDownload,
  AiAcademia,
  BiLockFill,
  BiCheckCircleFill,
  FaCaretDown,
  FaCaretUp,
  MdLaptopchromebook,
  RiMapPinUserFill,
  BiPauseFill,
  GiPadlock,
  RiInformationLine
} from 'oh-vue-icons/icons'

addIcons(
  BiCalendarCheck,
  MdArrowback,
  BiPeople,
  BiListCheck,
  BiThreeDotsVertical,
  MdMenu,
  BiCalendarEvent,
  BiPatchCheckFill,
  BiClock,
  RiErrorWarningFill,
  BiDownload,
  AiAcademia,
  BiLockFill,
  BiCheckCircleFill,
  FaCaretDown,
  FaCaretUp,
  MdLaptopchromebook,
  RiMapPinUserFill,
  BiPauseFill,
  GiPadlock,
  RiInformationLine
)

setup((app) => {
  //Register global vue components
  app.component('v-icon', OhVueIcon)
})

import '../src/main.scss'

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  }
}

export default preview
