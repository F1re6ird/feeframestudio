// ✅ Edge-compatible — no Node imports
export const runtime = "edge";

// Hash a password with PBKDF2 (SHA-256)
export async function hashPassword(password: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();

  // Convert the hex salt back to bytes
  const salt = Uint8Array.from(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

  // Import the password as a key
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password.normalize()),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  // Derive 64 bytes (512 bits) using PBKDF2 + SHA-256
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 310000,           // OWASP recommendation (adjust if needed)
      hash: "SHA-256"
    },
    keyMaterial,
    64 * 8                            // 64 bytes * 8 bits
  );

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(derivedBits));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").normalize();
}

// Generate a 16-byte salt as hex
export function generateSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("").normalize();
}
