import PageHeader from '@/components/molecules/page-header/PageHeader.vue'

export default {
  title: 'Components/Molecules/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  argTypes: {}
}

export const Default = {
  args: {
    label: 'Sala Personal'
  }
}

export const BackButton = {
  args: {
    label: 'Sala Personal',
    showBackButton: true
  }
}
