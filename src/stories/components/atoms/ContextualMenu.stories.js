import ContextualMenu from '@/components/atoms/ContextualMenu.vue'

export default {
  title: 'Components/Atoms/ContextualMenu',
  component: ContextualMenu,
  tags: ['autodocs'],
  argTypes: {
    trigger: {}
  }
}

export const Default = {
  args: {
    options: [
      { id: 'go-back', label: 'Go Back' },
      { id: 'go-forward', label: 'Go Forward' },
      { id: 'del-item', label: 'Delete Item', disabled: true },
      { id: 'block-item', label: 'Block Item', hidden: true }
    ]
  }
}
