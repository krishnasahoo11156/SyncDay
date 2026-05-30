import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 12 bytes for GCM
const AUTH_TAG_LENGTH = 16; // 16 bytes for GCM auth tag

// Retrieves the encryption key from environment variables and asserts it is 32 bytes (64 hex characters)
function getEncryptionKey(): Buffer {
  const hexKey = process.env.TOKEN_ENCRYPTION_KEY;
  if (!hexKey) {
    throw new Error("Missing TOKEN_ENCRYPTION_KEY environment variable.");
  }
  
  const key = Buffer.from(hexKey, "hex");
  if (key.length !== 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY must be a valid 32-byte (64 hex characters) key.");
  }
  
  return key;
}

/**
 * Encrypts a plain text string using AES-256-GCM
 */
export function encryptToken(plainText: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag();
  
  // Format as: iv_hex:auth_tag_hex:encrypted_text_hex
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts an encrypted token string using AES-256-GCM
 */
export function decryptToken(encryptedData: string): string {
  const key = getEncryptionKey();
  const parts = encryptedData.split(":");
  
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted token data format.");
  }
  
  const iv = Buffer.from(parts[0], "hex");
  const authTag = Buffer.from(parts[1], "hex");
  const encryptedText = Buffer.from(parts[2], "hex");
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, undefined, "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}
