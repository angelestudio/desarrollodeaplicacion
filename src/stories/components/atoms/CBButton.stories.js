import CbButton from '../../../components/atoms/CBButton.vue'

export default {
  title: 'Components/Atoms/CBButton',
  component: CbButton,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      description:
        "Use this slot to add an icon from 'oh-vue-icons' before the button's label. Please follow this link to learn how to implements icons from 'oh-vue-icons': https://oh-vue-icons.js.org/docs"
    },
    variant: {
      control: {
        type: 'select'
      },
      options: ['filled', 'tonal', 'tonal-room', 'elevated', 'outlined', 'text']
    }
  }
}

export const Filled = {
  args: {
    variant: 'filled',
    label: 'Button'
  }
}

export const Tonal = {
  args: {
    variant: 'tonal',
    label: 'Button'
  }
}

export const TonalRoom = {
  args: {
    variant: 'tonal-room',
    label: 'Button'
  }
}

export const Elevated = {
  args: {
    variant: 'elevated',
    label: 'Button'
  }
}

export const Outlined = {
  args: {
    variant: 'outlined',
    label: 'Button'
  }
}

export const Text = {
  args: {
    variant: 'text',
    label: 'Button'
  }
}
