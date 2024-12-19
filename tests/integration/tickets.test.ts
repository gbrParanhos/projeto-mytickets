import supertest from "supertest";
import app from "../../src/app";
import { cleanDb, connectDb, prisma } from "../db";
import { faker, id_ID } from "@faker-js/faker/.";
import httpStatus from "http-status";
import { TicketsFactory } from "../factories/tickets";
import { EventsFactory } from "../factories/events";

const api = supertest(app);

beforeAll(async () => {
  connectDb()
  await cleanDb()
})

beforeEach(async () => {
  await cleanDb()
})

describe("", () => {
  describe("POST", () => {
    it("should create an event", async () => {
      const { id } = await prisma.event.create({ data: EventsFactory.getValidBody() })
      const new_ticket = TicketsFactory.getValidBody(id)
      const resp = await api.post(`/tickets`).send(new_ticket)

      expect(resp.body).toEqual({
        id: expect.any(Number),
        owner: new_ticket.owner,
        code: new_ticket.code,
        used: false,
        eventId: id
      })
      expect(resp.status).toBe(httpStatus.CREATED)
    })
  })

  describe("PUT/use/:id", () => {
    it("should create an event", async () => {
      const new_event = await prisma.event.create({ data: EventsFactory.getValidBody() })
      const { id } = await prisma.ticket.create({ data: TicketsFactory.getValidBody(new_event.id) })
      const resp = await api.put(`/tickets/use/${id}`)

      expect(resp.status).toBe(httpStatus.NO_CONTENT)
    })
  })

  describe("GET/:id", () => {
    it("should create an event", async () => {
      const new_event = await prisma.event.create({ data: EventsFactory.getValidBody() })
      const new_ticket = await prisma.ticket.create({ data: TicketsFactory.getValidBody(new_event.id) })
      const resp = await api.get(`/tickets/${new_event.id}`)

      expect(resp.body[0]).toEqual(new_ticket)
      expect(resp.status).toBe(httpStatus.OK)
    })
  })
})