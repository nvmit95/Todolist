import { describe, it, expect } from "vitest"
import { loginSchema } from "./loginSchema"

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret",
      rememberMe: true,
    })

    expect(result.success).toBe(true)
  })

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret",
    })

    expect(result.success).toBe(false)
  })

  it("rejects password shorter than 3 characters", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "ab",
    })

    expect(result.success).toBe(false)
  })

  it("allows optional captcha field", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret",
      captcha: "abc123",
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.captcha).toBe("abc123")
    }
  })
})
