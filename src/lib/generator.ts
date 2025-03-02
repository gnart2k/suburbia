export function generateSignature(params: { [key: string]: string }, checksumKey: string): string {
    const sortedKeys = Object.keys(params).sort();
  
    const data = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  
    const signature = CryptoJS.HmacSHA256(data, checksumKey).toString(CryptoJS.enc.Hex);
  
    return signature;
  }
  
  