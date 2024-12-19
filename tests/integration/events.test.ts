import supertest from "supertest";
import app from "../../src/app";
import { EventsFactory } from "../factories/events"
import { cleanDb, connectDb, prisma } from "../db";
import { faker } from "@faker-js/faker/.";
import httpStatus from "http-status";

const api = supertest(app);

beforeAll(async () => {
  connectDb()
  await cleanDb()
})

beforeEach(async () => {
  await cleanDb()
})

describe("", () => {
  describe("GET", () => {
    it("must have 0 events", async () => {
      const resp = await api.get("/events")
      expect(resp.body).toHaveLength(0)
    })

    it("must have 2 events", async () => {
      await prisma.event.create({ data: EventsFactory.getValidBody() })
      await prisma.event.create({ data: EventsFactory.getValidBody() })
      const resp = await api.get("/events")
      expect(resp.body).toHaveLength(2)
    })
  })

  describe("GET/:id", () => {
    it("must have 0 events", async () => {
      const resp = await api.get(`/events/${faker.number.int({ min: 1, max: 10 })}`)
      expect(resp.statusCode).toBe(httpStatus.NOT_FOUND)
    })

    it("must have 1 event", async () => {
      const { id, date, name } = await prisma.event.create({ data: EventsFactory.getValidBody() })
      const resp = await api.get(`/events/${id}`)
      expect(resp.body).toEqual({
        id: id,
        name: name,
        date: date.toISOString(),
      })
    })
  })

  describe("POST", () => {
    it("should return a 422 error when body not sended", async () => {
      const resp = await api.post(`/events`)
      expect(resp.statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    })

    it("should return a 422 error when invalid body sended", async () => {
      const resp = await api.post(`/events`).send(EventsFactory.getInvalidBody())
      expect(resp.statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    })

    it("should return a 409 error when creating an event with the name of an existing event", async () => {
      const new_event = EventsFactory.getValidBody()
      await prisma.event.create({ data: new_event })
      const resp = await api.post(`/events`).send(new_event)

      expect(resp.status).toBe(httpStatus.CONFLICT)
    })

    it("should create an event", async () => {
      const new_event = EventsFactory.getValidBody()
      const resp = await api.post(`/events`).send(new_event)

      expect(resp.body).toEqual({
        id: expect.any(Number),
        name: new_event.name,
        date: new_event.date.toISOString(),
      })
      expect(resp.status).toBe(httpStatus.CREATED)
    })
  })

  describe("UPDATE/:id", () => {
    it("should return a 422 error when body not sended", async () => {
      const resp = await api.put(`/events/${faker.number.int({ min: 1, max: 10 })}`)
      expect(resp.statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    })

    it("should return a 422 error when invalid body sended", async () => {
      const resp = await api.put(`/events/${faker.number.int({ min: 1, max: 10 })}`).send(EventsFactory.getInvalidBody())
      expect(resp.statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    })

    it("should return a 404 error when invalid id sended", async () => {
      const resp = await api.put(`/events/${faker.number.int({ min: 1, max: 10 })}`).send(EventsFactory.getValidBody())
      expect(resp.statusCode).toBe(httpStatus.NOT_FOUND)
    })

    it("should update an event when exists", async () => {
      const event = await prisma.event.create({ data: EventsFactory.getValidBody() })
      const new_data = EventsFactory.getValidBody()
      const resp = await api.put(`/events/${event.id}`).send(new_data)

      expect(resp.body).toEqual({
        id: event.id,
        name: new_data.name,
        date: new_data.date.toISOString(),
      })
      expect(resp.status).toBe(httpStatus.OK)
    })
  })


  describe("DELETE/:id", () => {
    it("should return a 404 error when invalid id sended", async () => {
      const resp = await api.delete(`/events/${faker.number.int({ min: 1, max: 10 })}`)
      expect(resp.statusCode).toBe(httpStatus.NOT_FOUND)
    })

    it("should delete an event when exists", async () => {
      const event = await prisma.event.create({ data: EventsFactory.getValidBody() })
      const resp = await api.delete(`/events/${event.id}`)

      expect(resp.status).toBe(httpStatus.NO_CONTENT)
    })
  })
})