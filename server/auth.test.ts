import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { hashPassword, verifyPassword, validatePasswordStrength, validateUsername } from "./auth-utils";

describe("Authentication Utilities", () => {
  describe("Password Hashing", () => {
    it("should hash a password", async () => {
      const password = "TestPassword123!";
      const hash = await hashPassword(password);
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });

    it("should verify a correct password", async () => {
      const password = "TestPassword123!";
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it("should reject an incorrect password", async () => {
      const password = "TestPassword123!";
      const wrongPassword = "WrongPassword123!";
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    it("should produce different hashes for the same password", async () => {
      const password = "TestPassword123!";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("Password Strength Validation", () => {
    it("should accept a strong password", () => {
      const result = validatePasswordStrength("StrongPass123!");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject a password that is too short", () => {
      const result = validatePasswordStrength("Pass1!");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must be at least 8 characters long");
    });

    it("should reject a password without uppercase letters", () => {
      const result = validatePasswordStrength("password123!");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one uppercase letter");
    });

    it("should reject a password without lowercase letters", () => {
      const result = validatePasswordStrength("PASSWORD123!");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one lowercase letter");
    });

    it("should reject a password without numbers", () => {
      const result = validatePasswordStrength("PasswordABC!");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one number");
    });

    it("should reject a password without special characters", () => {
      const result = validatePasswordStrength("Password123");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one special character (!@#$%^&*)");
    });

    it("should accept all valid special characters", () => {
      const specialChars = ["!", "@", "#", "$", "%", "^", "&", "*"];
      for (const char of specialChars) {
        const result = validatePasswordStrength(`StrongPass123${char}`);
        expect(result.valid).toBe(true);
      }
    });
  });

  describe("Username Validation", () => {
    it("should accept a valid username", () => {
      const result = validateUsername("john_doe-123");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject a username that is too short", () => {
      const result = validateUsername("ab");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Username must be at least 3 characters long");
    });

    it("should reject a username that is too long", () => {
      const result = validateUsername("a".repeat(101));
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Username must be no more than 100 characters");
    });

    it("should reject a username with invalid characters", () => {
      const result = validateUsername("john@doe");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Username can only contain letters, numbers, underscores, and hyphens");
    });

    it("should accept usernames with letters, numbers, underscores, and hyphens", () => {
      const validUsernames = ["user123", "user_name", "user-name", "User_Name-123"];
      for (const username of validUsernames) {
        const result = validateUsername(username);
        expect(result.valid).toBe(true);
      }
    });

    it("should reject usernames with spaces", () => {
      const result = validateUsername("john doe");
      expect(result.valid).toBe(false);
    });

    it("should reject usernames with special characters", () => {
      const specialChars = ["!", "@", "#", "$", "%", "^", "&", "*", ".", ",", ";"];
      for (const char of specialChars) {
        const result = validateUsername(`user${char}name`);
        expect(result.valid).toBe(false);
      }
    });
  });
});
