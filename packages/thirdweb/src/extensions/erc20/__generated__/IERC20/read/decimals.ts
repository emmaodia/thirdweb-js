import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x313ce567" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint8",
  },
] as const;

/**
 * Checks if the `decimals` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `decimals` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isDecimalsSupported } from "thirdweb/extensions/erc20";
 * const supported = isDecimalsSupported(["0x..."]);
 * ```
 */
export function isDecimalsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the decimals function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC20
 * @example
 * ```ts
 * import { decodeDecimalsResult } from "thirdweb/extensions/erc20";
 * const result = decodeDecimalsResultResult("...");
 * ```
 */
export function decodeDecimalsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "decimals" function on the contract.
 * @param options - The options for the decimals function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```ts
 * import { decimals } from "thirdweb/extensions/erc20";
 *
 * const result = await decimals({
 *  contract,
 * });
 *
 * ```
 */
export async function decimals(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
