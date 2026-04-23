// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Kairon — attestation protocol for AI agent work
/// @notice Emits tamper-evident records when an agent seals a ticket.
/// @dev No storage, no ownership, no upgrades. The chain is the record.
contract Kairon {
    /// @notice Emitted when a ticket is sealed.
    /// @param proofHash SHA-256 over the sealed outcome (ticket + criteria + results).
    /// @param signer The address submitting the attestation.
    /// @param timestamp Block timestamp of the seal.
    event Sealed(bytes32 indexed proofHash, address indexed signer, uint256 timestamp);

    /// @notice Seal a single attestation.
    function seal(bytes32 proofHash) external {
        emit Sealed(proofHash, msg.sender, block.timestamp);
    }

    /// @notice Seal many attestations in one transaction. Used for batch seeding and multi-ticket flows.
    function sealMany(bytes32[] calldata hashes) external {
        uint256 len = hashes.length;
        for (uint256 i = 0; i < len; ) {
            emit Sealed(hashes[i], msg.sender, block.timestamp);
            unchecked { ++i; }
        }
    }
}
