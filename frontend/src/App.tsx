import { useEffect, useState } from "react";
import { createPublicClient, formatEther, parseEventLogs, encodeFunctionData, http, parseAbi } from "viem";

type WalletProvider = {
  request(args: { method: "eth_requestAccounts" }): Promise<string[]>;
  request(args: { method: "eth_chainId" }): Promise<string>;
  request(args: {
  method: "eth_sendTransaction";
  params: [{ from: string; to: string; data: string }];
}): Promise<`0x${string}`>;
};

type WalletAnnouncement = {
  info: { rdns: string };
  provider: WalletProvider;
};

const nftAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const nftAbi = parseAbi([
  "function mint() returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
]);const localClient = createPublicClient({
  transport: http("http://127.0.0.1:8545"),
});

export default function App() {
  const [provider, setProvider] = useState<WalletProvider | null>(null);
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [minting, setMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState("");

  useEffect(() => {
    function onWalletAnnounced(event: Event) {
      const { info, provider } = (event as CustomEvent<WalletAnnouncement>).detail;

      if (info.rdns === "com.brave.wallet" || info.rdns === "io.metamask") {
        setProvider(provider);
      }
    }

    window.addEventListener("eip6963:announceProvider", onWalletAnnounced);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () => {
      window.removeEventListener("eip6963:announceProvider", onWalletAnnounced);
    };
  }, []);

  async function connectWallet() {
    setError("");
    setAccount("");

    if (!provider) {
      setError("Wallet was not detected. Enable the extension and reload.");
      return;
    }

    setConnecting(true);

    try {
      const chainId = await provider.request({ method: "eth_chainId" });

      if (chainId !== "0x7a69") {
        setError(`Wallet reported chain ${chainId}. Select Hardhat Local and try again.`);
        return;
      }

      const [selectedAccount] = await provider.request({
        method: "eth_requestAccounts",
      });

      setAccount(selectedAccount ?? "");

      if (!selectedAccount) {
        setError("Wallet did not return an account.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not connect to wallet.");
    } finally {
      setConnecting(false);
    }
  }

  async function mintNFT() {
  if (!provider || !account) return;

  setError("");
  setMinting(true);
  setMintStatus("");

  try {
    const chainId = await provider.request({ method: "eth_chainId" });

    if (chainId !== "0x7a69") {
      setError("Select Hardhat Local in Brave Wallet before minting.");
      return;
    }

    const hash = await provider.request({
      method: "eth_sendTransaction",
      params: [{
        from: account,
        to: nftAddress,
        data: encodeFunctionData({ abi: nftAbi, functionName: "mint" }),
      }],
    });

    setMintStatus("Waiting for confirmation…");
    const receipt = await localClient.waitForTransactionReceipt({ hash });

    if (receipt.status !== "success") {
      throw new Error("The mint transaction reverted.");
    }

const [mintEvent] = parseEventLogs({
  abi: nftAbi,
  eventName: "Transfer",
  logs: receipt.logs.filter(
    (log) => log.address.toLowerCase() === nftAddress.toLowerCase(),
  ),
});

const fee = formatEther(receipt.gasUsed * receipt.effectiveGasPrice);
const minted = mintEvent
  ? `Minted AGX NFT #${mintEvent.args.tokenId}.`
  : "AGX NFT minted successfully.";

setMintStatus(`${minted} Gas paid: ${fee} test ETH.`);  } catch (error) {
    setMintStatus("");
    setError(error instanceof Error ? error.message : "Could not mint the NFT.");
  } finally {
    setMinting(false);
  }
}

  return (
    <main>
      <h1>AGX NFT</h1>
      <img
  src="https://red-advanced-vole-637.mypinata.cloud/ipfs/bafkreicecujkkwudc27sxpu5dkjachtayj2n7pnvuzf4ghd6mvqoiwwdyu"
  alt="AGX NFT artwork"
  width={280}
  style={{ display: "block", margin: "0 auto 24px" }}
/>
      <button type="button" onClick={connectWallet} disabled={connecting}>
        {connecting ? "Connecting…" : "Connect Wallet"}
      </button>
      {account && <p>Connected account: {account}</p>}
      {account && (
  <button type="button" onClick={mintNFT} disabled={minting}>
    {minting ? "Minting…" : "Mint AGX NFT"}
  </button>
)}
{mintStatus && <p role="status">{mintStatus}</p>}
      {error && <p role="alert">{error}</p>}
    </main>
  );
}
