import LabelRoom from '@/components/atoms/LabelRoom.vue'

export default {
  title: 'Components/Atoms/RoomLabel',
  component: LabelRoom,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: {
        type: 'select'
      },
      options: ['neutral', 'alert', 'success']
    }
  }
}

export const Neutral = {
  args: {
    variant: 'neutral',
    label: 'Example text: (43)'
  }
}

export const Success = {
  args: {
    variant: 'success',
    label: 'Example text: (43)'
  }
}

export const Alert = {
  args: {
    variant: 'alert',
    label: 'Example text: (43)'
  }
}
