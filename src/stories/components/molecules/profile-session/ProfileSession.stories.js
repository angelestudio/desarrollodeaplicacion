import ProfileSession from '@/components/molecules/profile-session/ProfileSession.vue'

export default {
  title: 'Components/Molecules/ProfileSession',
  component: ProfileSession,
  tags: ['autodocs'],
  argTypes: {}
}

export const Default = {
  args: {
    date: '10/8/2023, 10:14:03 PM',
    title: 'Audiencia Pública - Proyecto de Ley No. 000000 de 2999',
    at: 'Comisión Primera de Cámara de Representantes',
    userRole: 'Secretario',
    sessionType: 'Ordinaria',
    finished: false
  }
}
