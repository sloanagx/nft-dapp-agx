// SPDX-License-Identifier: MIT

pragma solidity ^0.8.34;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract AGXNFT is ERC721 {
    uint256 private nextTokenId = 1;
    constructor() ERC721("AGX NFT", "AGX") {}
    function mint() external returns (uint256 tokenId) {
    tokenId = nextTokenId;
    nextTokenId += 1;

    _safeMint(msg.sender, tokenId);
}
}