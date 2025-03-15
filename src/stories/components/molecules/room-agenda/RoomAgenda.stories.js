import RoomAgenda from '@/components/molecules/room-agenda/RoomAgenda.vue'

export default {
  title: 'Components/Molecules/RoomAgenda',
  component: RoomAgenda,
  tags: ['autodocs'],
  argTypes: {}
}

export const Default = {
  args: {
    items: [
      {
        roomItemId: 6,
        name: 'Ítem 1',
        description: 'asdasdasda    ',
        subItems: [],
        documents: [],
        question: null,
        pollTypeId: null,
        durationMinutes: null,
        pollResultTypeId: null,
        answers: [],
        status: 2,
        order: 0,
        roomItemType: 1,
        createdOn: '2023-08-11T03:59:07.534914',
        createdBy: null
      },
      {
        roomItemId: 7,
        name: null,
        description: null,
        subItems: [],
        documents: [],
        question: '¿votacion 1?',
        pollTypeId: 1,
        durationMinutes: 30,
        pollResultTypeId: null,
        answers: [
          {
            roomPollAnswerId: 7,
            answer: 'Sí',
            orderName: null,
            order: 0,
            createdOn: '2023-08-11T03:59:07.5349342',
            createdBy: null,
            localImageUrl: null,
            externalImageUrl: null
          },
          {
            roomPollAnswerId: 8,
            answer: 'No',
            orderName: null,
            order: 1,
            createdOn: '2023-08-11T03:59:07.5349375',
            createdBy: null,
            localImageUrl: null,
            externalImageUrl: null
          }
        ],
        status: 2,
        order: 1,
        roomItemType: 2,
        createdOn: '2023-08-11T03:59:07.5349254',
        createdBy: null
      },
      {
        roomItemId: 8,
        name: 'con subitems',
        description: '',
        subItems: [
          {
            roomSubItemId: 1,
            name: 'Sub ítem 1',
            description: '',
            documents: [],
            order: 0,
            question: null,
            pollTypeId: null,
            durationMinutes: null,
            pollResultTypeId: null,
            answers: [],
            roomItemType: 1,
            status: 0,
            createdOn: '2023-08-11T03:59:07.5349431',
            createdBy: null
          },
          {
            roomSubItemId: 2,
            name: null,
            description: null,
            documents: [],
            order: 1,
            question: '¿Pregunta subitem?',
            pollTypeId: 1,
            durationMinutes: 30,
            pollResultTypeId: null,
            answers: [
              {
                roomPollAnswerId: 9,
                answer: 'Sí',
                orderName: null,
                order: 0,
                createdOn: '2023-08-11T03:59:07.5349536',
                createdBy: null,
                localImageUrl: null,
                externalImageUrl: null
              },
              {
                roomPollAnswerId: 10,
                answer: 'No',
                orderName: null,
                order: 1,
                createdOn: '2023-08-11T03:59:07.5349554',
                createdBy: null,
                localImageUrl: null,
                externalImageUrl: null
              }
            ],
            roomItemType: 2,
            status: 0,
            createdOn: '2023-08-11T03:59:07.5349499',
            createdBy: null
          }
        ],
        documents: [],
        question: null,
        pollTypeId: null,
        durationMinutes: null,
        pollResultTypeId: null,
        answers: [],
        status: 1,
        order: 2,
        roomItemType: 1,
        createdOn: '2023-08-11T03:59:07.53494',
        createdBy: null
      }
    ]
  }
}
