// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PramaanQR {
    mapping(bytes32 => bool) private valid;
    mapping(bytes32 => address) public issuer;

    function issueCredential(bytes32 hash) external {
        require(!valid[hash], "Already issued");
        valid[hash] = true;
        issuer[hash] = msg.sender;
    }

    function verifyCredential(bytes32 hash)
        external
        view
        returns (bool)
    {
        return valid[hash];
    }
}
