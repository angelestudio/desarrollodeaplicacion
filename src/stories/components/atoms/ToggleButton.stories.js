import ToggleButton from '../../../components/atoms/ToggleButton.vue'

export default {
  title: 'Components/Atoms/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  argTypes: {
    toggle: {
      description:
        'This event is dispatched at clicking the button and it sends the next data: { pressed: true/false }'
    },
    pressed: {
      description: 'This slot is rendered when the button is pressed.'
    },
    released: {
      description: 'This slot is rendered when the button is released'
    },
    default: {
      description:
        'If you have the same content for pressed/released states, you can use this default slot.'
    },
    variant: {
      control: {
        type: 'select'
      },
      options: ['enabling', 'disabling']
    }
  }
}

export const Enabling = {
  args: {
    variant: 'enabling'
  }
}

export const Disabling = {
  args: {
    variant: 'disabling'
  }
}
