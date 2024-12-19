import { Ticket } from "@prisma/client";
import { faker } from '@faker-js/faker';

export const TicketsFactory = {
  getValidBody: (eventId: number): Omit<Ticket, "id" | "used"> => {
    return {
      owner: faker.person.fullName(),
      code: faker.string.uuid(),
      eventId
    }
  }
}