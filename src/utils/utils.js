import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid';

export const JWT_SECRET = "test";
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numericLength = 5;
export const ENCRYPTION_KEY = Buffer.from(
  "uN9a1gQ3KPJbbC+k1b3E9T62j90G7o3lsoJDD9SH3hQ=",
  "base64"
);
const IV_LENGTH = 16; 

// Función para cifrar
export function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

export function CompileErrorReport(error) {
    if (error == null) return "";
    let fullErrors = error.errorMessage;
    for (let paramName in error.errorDetails)
      for (let msgIdx in error.errorDetails[paramName])
        fullErrors += `\n${paramName}: ${error.errorDetails[paramName][msgIdx]}`;
    return fullErrors;
  }
// Función para descifrar
export function decrypt(text) {
  let textParts = text.split(":");
  let iv = Buffer.from(textParts.shift(), "hex");
  let encryptedText = Buffer.from(textParts.join(":"), "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

  try {
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Error during decryption:", error);
    throw new Error("Failed to decrypt data");
  }
}

export function incrementCode(code) {
  const [letterPart, numberPart] = [code.slice(0, 3), code.slice(3)];
  let number = parseInt(numberPart, 10) + 1;

  if (number > 99999) {
    number = 1;
    let lettersArray = letterPart.split('');
    for (let i = lettersArray.length - 1; i >= 0; i--) {
      let newCharIndex = letters.indexOf(lettersArray[i]) + 1;
      if (newCharIndex < letters.length) {
        lettersArray[i] = letters[newCharIndex];
        break;
      } else {
        lettersArray[i] = letters[0];
      }
    }
    letterPart = lettersArray.join('');
  }

  return `${letterPart}${number.toString().padStart(numericLength, '0')}`;
}

export function generateCodeId() {
    const uuid = uuidv4().replace(/-/g, ''); // Elimina los guiones
    const lettersPart1 = uuid.substring(0, 2).toUpperCase(); // Primeras dos letras
    const numbersPart = uuid.substring(2, 5); // Tres números
    const lettersPart2 = uuid.substring(5, 8).toUpperCase(); // Últimas tres letras
    const timestamp = Date.now().toString().slice(-6);
    return `${lettersPart1}${numbersPart}${lettersPart2}${timestamp}`;
}


