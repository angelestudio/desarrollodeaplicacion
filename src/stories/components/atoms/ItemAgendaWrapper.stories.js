import ItemAgendaWrapper from '@/components/atoms/ItemAgendaWrapper.vue'

export default {
  title: 'Components/Atoms/ItemAgendaWrapper',
  component: ItemAgendaWrapper,
  tags: ['autodocs']
}

export const Default = {
  args: {
    title: '1. Item',
    subItem: false,
    menu: []
  }
}

export const DefaultSubItem = {
  args: {
    title: '1. Item',
    subItem: true,
    menu: []
  }
}

export const Active = {
  args: {
    title: '1. Item',
    subItem: false,
    menu: [{ id: 'asd', label: 'Enter' }],
    status: 'active'
  }
}

export const ActiveSubItem = {
  args: {
    title: '1. Item',
    subItem: true,
    menu: [{ id: 'asd', label: 'Enter' }],
    status: 'active'
  }
}

export const Locked = {
  args: {
    title: '1. Item',
    subItem: false,
    menu: [{ id: 'asd', label: 'Enter' }],
    status: 'locked'
  }
}
