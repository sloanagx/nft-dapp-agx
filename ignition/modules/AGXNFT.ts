import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AGXNFTModule", (m) => {
  const metadataURI =
    "ipfs://bafkreigyuo6xrk5eehqyj64kb524kovx7vc5o2zhsy6gfi7shlmvnovhk4";

  const agxNFT = m.contract("AGXNFT", [metadataURI]);

  return { agxNFT };
});