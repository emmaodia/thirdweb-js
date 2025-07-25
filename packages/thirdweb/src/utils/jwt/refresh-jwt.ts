import type { Account } from "../../wallets/interfaces/wallet.js";
import { decodeJWT } from "./decode-jwt.js";
import { encodeJWT } from "./encode-jwt.js";

const DEFAULT_EXPIRATION_TIME = 60 * 60 * 24;

export type RefreshJWTParams = {
  account: Account;
  jwt: string;
  expirationTime?: number;
};

/**
 * Refreshes a JSON Web Token (JWT) by encoding a new payload with updated expiration time.
 * @param options - The options for refreshing the JWT.
 * @returns A Promise that resolves to the refreshed JWT.
 * @example
 * ```ts
 * import { refreshJWT } from 'thirdweb/utils';
 *
 * const jwt = await refreshJWT({
 *  account,
 *  jwt,
 *  expirationTime: 1000 * 60 * 60,
 * });
 * ```
 * @auth
 */
export async function refreshJWT(options: RefreshJWTParams): Promise<string> {
  const { account, jwt, expirationTime = DEFAULT_EXPIRATION_TIME } = options;
  const payload = decodeJWT(jwt).payload;
  return encodeJWT({
    account,
    payload: {
      aud: payload.aud,
      ctx: payload.ctx,
      exp: new Date(Date.now() + expirationTime),
      iat: new Date(),
      iss: payload.iss,
      nbf: new Date(),
      sub: payload.sub,
    },
  });
}
