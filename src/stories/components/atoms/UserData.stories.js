import UserData from '@/components/atoms/UserData.vue'

export default {
  title: 'Components/Atoms/UserData',
  component: UserData,
  tags: ['autodocs'],
  argTypes: {}
}

export const WithData = {
  args: {
    name: 'Haruhi Suzumiya',
    role: 'Kami-sama',
    photo: 'https://junkyardview.files.wordpress.com/2019/05/haruhi-1.jpg'
  }
}
export const WithoutData = {
  args: {}
}
