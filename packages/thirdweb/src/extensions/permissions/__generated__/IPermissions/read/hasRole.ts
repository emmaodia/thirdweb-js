import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "hasRole" function.
 */
export type HasRoleParams = {
  role: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "role" }>;
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export const FN_SELECTOR = "0x91d14854" as const;
const FN_INPUTS = [
  {
    name: "role",
    type: "bytes32",
  },
  {
    name: "account",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `hasRole` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `hasRole` method is supported.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { isHasRoleSupported } from "thirdweb/extensions/permissions";
 * const supported = isHasRoleSupported(["0x..."]);
 * ```
 */
export function isHasRoleSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "hasRole" function.
 * @param options - The options for the hasRole function.
 * @returns The encoded ABI parameters.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { encodeHasRoleParams } from "thirdweb/extensions/permissions";
 * const result = encodeHasRoleParams({
 *  role: ...,
 *  account: ...,
 * });
 * ```
 */
export function encodeHasRoleParams(options: HasRoleParams) {
  return encodeAbiParameters(FN_INPUTS, [options.role, options.account]);
}

/**
 * Encodes the "hasRole" function into a Hex string with its parameters.
 * @param options - The options for the hasRole function.
 * @returns The encoded hexadecimal string.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { encodeHasRole } from "thirdweb/extensions/permissions";
 * const result = encodeHasRole({
 *  role: ...,
 *  account: ...,
 * });
 * ```
 */
export function encodeHasRole(options: HasRoleParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeHasRoleParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the hasRole function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { decodeHasRoleResult } from "thirdweb/extensions/permissions";
 * const result = decodeHasRoleResultResult("...");
 * ```
 */
export function decodeHasRoleResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "hasRole" function on the contract.
 * @param options - The options for the hasRole function.
 * @returns The parsed result of the function call.
 * @extension PERMISSIONS
 * @example
 * ```ts
 * import { hasRole } from "thirdweb/extensions/permissions";
 *
 * const result = await hasRole({
 *  contract,
 *  role: ...,
 *  account: ...,
 * });
 *
 * ```
 */
export async function hasRole(options: BaseTransactionOptions<HasRoleParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.role, options.account],
  });
}
