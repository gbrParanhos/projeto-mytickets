import { Event } from "@prisma/client";
import { faker } from '@faker-js/faker';

export const EventsFactory = {
  getValidBody: (): Omit<Event, "id"> => {
    return {
      date: faker.date.future(),
      name: faker.company.name()
    }
  },

  getInvalidBody: (): Omit<Event, "id"> => {
    return {
      date: faker.date.past(),
      name: faker.company.name()
    }
  }
}