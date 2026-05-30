import { encryptToken, decryptToken } from "../src/lib/crypto/tokens";

// Manual test execution script
function runTest() {
  // Setup temporary test environment variables
  process.env.TOKEN_ENCRYPTION_KEY = "2c6c3553652d2a2e2a26be8dc7e979468b274d8d6f9d6ab03c1e8c343faa6c2f";
  
  const sampleToken = "ya29.a0AeD1PrD_sample_google_refresh_token_xyz_12345";
  console.log("--------------------------------------------------");
  console.log(" Cryptographic Symmetric Cipher Test (AES-256-GCM) ");
  console.log("--------------------------------------------------");
  console.log("Original plain text:", sampleToken);
  
  try {
    const encrypted = encryptToken(sampleToken);
    console.log("Encrypted text payload:", encrypted);
    
    const decrypted = decryptToken(encrypted);
    console.log("Decrypted text output: ", decrypted);
    
    if (sampleToken === decrypted) {
      console.log("\n[SUCCESS] Decrypted token matches the original perfectly!");
    } else {
      console.error("\n[FAIL] Decrypted text mismatch!");
    }
  } catch (err: any) {
    console.error("\n[ERROR] Cryptographic execution failed:", err.message);
  }
  console.log("--------------------------------------------------\n");
}

runTest();
