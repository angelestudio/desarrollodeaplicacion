import BadgeLabel from '@/components/atoms/BadgeLabel.vue'

export default {
  title: 'Components/Atoms/BadgeLabel',
  component: BadgeLabel,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: {
        type: 'select'
      },
      options: ['live', 'start-soon', 'today', 'future', 'archive']
    }
  }
}

export const Live = {
  args: {
    variant: 'live',
    label: 'Live'
  }
}

export const StartSoon = {
  args: {
    variant: 'start-soon',
    label: 'Empieza pronto'
  }
}

export const Today = {
  args: {
    variant: 'today',
    label: 'Today - 2:30 PM'
  }
}
export const FutureOne = {
  args: {
    variant: 'future',
    label: 'Mañana 4:00 PM'
  }
}

export const FutureTwo = {
  args: {
    variant: 'future',
    label: '23/08/2023'
  }
}

export const Achive = {
  args: {
    variant: 'archive',
    label: '23/04/2023'
  }
}
