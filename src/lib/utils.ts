import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import CryptoJS from "crypto-js";

const  SECRET_KEY = import.meta.env.SECRET_SECRET; 

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function downloadImage(url : string, filename = 'downloaded-image.png') {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      console.log(blob)
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(err => console.error('Download failed:', err));
}


export function detectApiKeyType(key: string): any {
  if (!key || typeof key !== "string") {
    return "unknown";
  }
  
  key = key.trim();
  
  // Heuristic for OpenRouter
  // According to GitGuardian its detector checks for prefix: "sk-or-v1-"
  if (key.startsWith("sk-or-v1-")) {
    return "openrouter";
  }
  
  // Heuristic for Gemini / Google
  // Many Google API keys start with "AIza"
  if (key.startsWith("AIza")) {
    return "gemini";
  }
  
  // Additional checks could be done:
  // - length
  // - allowed characters (e.g. alphanumeric + dash/underscore)
  // - regex matching
  // - maybe test with actual API request
  
  return false;
}

export function encryptData(data) {
  const jsonData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();
}

export function decryptData(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}