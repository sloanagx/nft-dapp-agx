// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract AGXNFT is ERC721 {
    uint256 private nextTokenId = 1;
    string private metadataURI;

    constructor(string memory metadataURI_) ERC721("AGX NFT", "AGX") {
        metadataURI = metadataURI_;
    }

    function mint() external returns (uint256 tokenId) {
        tokenId = nextTokenId;
        nextTokenId += 1;

        _safeMint(msg.sender, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return metadataURI;
    }
}