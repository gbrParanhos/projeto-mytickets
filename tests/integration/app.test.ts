import supertest from "supertest";
import app from "../../src/app";

const api = supertest(app);

describe("GET", () => {
  describe("/health", () => {
    it("must return 'I'm okay!'", async () => {
      const resp = await api.get("/health")
      expect(resp.statusCode).toBe(200)
      expect(resp.text).toBe("I'm okay!")
    })
  })
})