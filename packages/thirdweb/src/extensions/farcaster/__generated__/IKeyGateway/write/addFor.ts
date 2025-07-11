import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "addFor" function.
 */
export type AddForParams = WithOverrides<{
  fidOwner: AbiParameterToPrimitiveType<{ type: "address"; name: "fidOwner" }>;
  keyType: AbiParameterToPrimitiveType<{ type: "uint32"; name: "keyType" }>;
  key: AbiParameterToPrimitiveType<{ type: "bytes"; name: "key" }>;
  metadataType: AbiParameterToPrimitiveType<{
    type: "uint8";
    name: "metadataType";
  }>;
  metadata: AbiParameterToPrimitiveType<{ type: "bytes"; name: "metadata" }>;
  deadline: AbiParameterToPrimitiveType<{ type: "uint256"; name: "deadline" }>;
  sig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "sig" }>;
}>;

export const FN_SELECTOR = "0xa005d3d2" as const;
const FN_INPUTS = [
  {
    name: "fidOwner",
    type: "address",
  },
  {
    name: "keyType",
    type: "uint32",
  },
  {
    name: "key",
    type: "bytes",
  },
  {
    name: "metadataType",
    type: "uint8",
  },
  {
    name: "metadata",
    type: "bytes",
  },
  {
    name: "deadline",
    type: "uint256",
  },
  {
    name: "sig",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `addFor` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `addFor` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isAddForSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = isAddForSupported(["0x..."]);
 * ```
 */
export function isAddForSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "addFor" function.
 * @param options - The options for the addFor function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeAddForParams } from "thirdweb/extensions/farcaster";
 * const result = encodeAddForParams({
 *  fidOwner: ...,
 *  keyType: ...,
 *  key: ...,
 *  metadataType: ...,
 *  metadata: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 * ```
 */
export function encodeAddForParams(options: AddForParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.fidOwner,
    options.keyType,
    options.key,
    options.metadataType,
    options.metadata,
    options.deadline,
    options.sig,
  ]);
}

/**
 * Encodes the "addFor" function into a Hex string with its parameters.
 * @param options - The options for the addFor function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeAddFor } from "thirdweb/extensions/farcaster";
 * const result = encodeAddFor({
 *  fidOwner: ...,
 *  keyType: ...,
 *  key: ...,
 *  metadataType: ...,
 *  metadata: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 * ```
 */
export function encodeAddFor(options: AddForParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeAddForParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "addFor" function on the contract.
 * @param options - The options for the "addFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { addFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = addFor({
 *  contract,
 *  fidOwner: ...,
 *  keyType: ...,
 *  key: ...,
 *  metadataType: ...,
 *  metadata: ...,
 *  deadline: ...,
 *  sig: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function addFor(
  options: BaseTransactionOptions<
    | AddForParams
    | {
        asyncParams: () => Promise<AddForParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
    contract: options.contract,
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [
        resolvedOptions.fidOwner,
        resolvedOptions.keyType,
        resolvedOptions.key,
        resolvedOptions.metadataType,
        resolvedOptions.metadata,
        resolvedOptions.deadline,
        resolvedOptions.sig,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
