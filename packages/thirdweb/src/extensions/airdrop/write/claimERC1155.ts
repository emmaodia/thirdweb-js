import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Address } from "../../../utils/address.js";
import { fetchProofsERC1155 } from "../../../utils/extensions/airdrop/fetch-proofs-erc1155.js";
import { tokenMerkleRoot } from "../__generated__/Airdrop/read/tokenMerkleRoot.js";
import { claimERC1155 as generatedClaimERC1155 } from "../__generated__/Airdrop/write/claimERC1155.js";

/**
 * @extension AIRDROP
 */
export type ClaimERC1155Params = {
  tokenAddress: string;
  recipient: string;
};

/**
 * Claim airdrop of ERC1155 tokens for allowlisted addresses. (Pull based airdrop)
 * @param options - The transaction options.
 * @example
 * ```ts
 * import { claimERC1155 } from "thirdweb/extensions/airdrop";
 * import { sendTransaction } from "thirdweb";
 *
 * const tokenAddress = "0x..." // Address of airdropped tokens to claim
 * const recipient = "0x..."  // Address of the allowlisted recipient
 *
 * const claimTransaction = claimERC1155({
 *    contract,
 *    tokenAddress,
 *    recipient
 * });
 *
 * await sendTransaction({ claimTransaction, account });
 *
 * ```
 * @extension AIRDROP
 * @returns A promise that resolves to the transaction result.
 */
export function claimERC1155(
  options: BaseTransactionOptions<ClaimERC1155Params>,
) {
  return generatedClaimERC1155({
    asyncParams: async () => {
      const merkleRoot = await tokenMerkleRoot({
        contract: options.contract,
        tokenAddress: options.tokenAddress,
      });

      const tokenAddress = options.tokenAddress;

      const merkleProof = await fetchProofsERC1155({
        contract: options.contract,
        merkleRoot,
        recipient: options.recipient,
      });

      if (!merkleProof) {
        throw new Error("Proof not found for recipient address");
      }

      return {
        proofs: merkleProof.proof,
        quantity: merkleProof.quantity,
        receiver: merkleProof.recipient as Address,
        token: tokenAddress as Address,
        tokenId: merkleProof.tokenId,
      } as const;
    },
    contract: options.contract,
  });
}
