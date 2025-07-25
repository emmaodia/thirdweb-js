import type { Chain } from "../../chains/types.js";
import {
  getChainDecimals,
  getChainNativeCurrencyName,
  getChainSymbol,
} from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../constants/addresses.js";
import { getContract } from "../../contract/contract.js";
import type { GetBalanceResult } from "../../extensions/erc20/read/getBalance.js";
import { eth_getBalance } from "../../rpc/actions/eth_getBalance.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { toTokens } from "../../utils/units.js";

export type GetWalletBalanceOptions = {
  address: string;
  client: ThirdwebClient;
  chain: Chain;
  /**
   * (Optional) The address of the token to retrieve the balance for. If not provided, the balance of the native token will be retrieved.
   */
  tokenAddress?: string;
};

export type GetWalletBalanceResult = GetBalanceResult;

/**
 * Retrieves the balance of a token or native currency for a given wallet.
 * @param options - The options for retrieving the token balance.
 * @param options.address - The address for which to retrieve the balance.
 * @param options.client - The Thirdweb client to use for the request.
 * @param options.chain - The chain for which to retrieve the balance.
 * @param options.tokenAddress - (Optional) The address of the token to retrieve the balance for. If not provided, the balance of the native token will be retrieved.
 * @returns A promise that resolves to the token balance result.
 * @example
 * ```ts
 * import { getWalletBalance } from "thirdweb/wallets";
 * const balance = await getWalletBalance({ address, client, chain, tokenAddress });
 * ```
 * @walletUtils
 */
export async function getWalletBalance(
  options: GetWalletBalanceOptions,
): Promise<GetBalanceResult> {
  const { address, client, chain, tokenAddress } = options;
  // erc20 case
  if (tokenAddress) {
    // load balanceOf dynamically to avoid circular dependency
    const { getBalance } = await import(
      "../../extensions/erc20/read/getBalance.js"
    );
    return getBalance({
      address,
      contract: getContract({ address: tokenAddress, chain, client }),
    });
  }
  // native token case
  const rpcRequest = getRpcClient({ chain, client });

  const [nativeSymbol, nativeDecimals, nativeName, nativeBalance] =
    await Promise.all([
      getChainSymbol(chain),
      getChainDecimals(chain),
      getChainNativeCurrencyName(chain),
      eth_getBalance(rpcRequest, { address }),
    ]);

  return {
    chainId: chain.id,
    decimals: nativeDecimals,
    displayValue: toTokens(nativeBalance, nativeDecimals),
    name: nativeName,
    symbol: nativeSymbol,
    tokenAddress: tokenAddress ?? NATIVE_TOKEN_ADDRESS,
    value: nativeBalance,
  };
}
