import { network } from "hardhat";

const { viem } = await network.create();
const publicClient = await viem.getPublicClient();

const agxNFT = await viem.getContractAt(
  "AGXNFT",
  "0x5FbDB2315678afecb367f032d93F642f64180aa3",
);

const hash = await agxNFT.write.mint();
const receipt = await publicClient.waitForTransactionReceipt({ hash });

console.log("Transaction status:", receipt.status);
console.log("Owner of token #1:", await agxNFT.read.ownerOf([1n]));
console.log("Metadata URI:", await agxNFT.read.tokenURI([1n]));