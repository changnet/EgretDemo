// https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html

// another typescript crypto library: https://www.npmjs.com/package/@types/crypto-js

export as namespace CryptoJS;

/**
 * MD5 hash algorithm
 * @param str string to be hashed
 * @returns md5 digest
 */
export function MD5(str: string): string;
