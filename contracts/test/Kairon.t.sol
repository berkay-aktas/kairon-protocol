// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Kairon} from "../src/Kairon.sol";

contract KaironTest is Test {
    Kairon kairon;

    bytes32 constant HASH_A = 0x1111111111111111111111111111111111111111111111111111111111111111;
    bytes32 constant HASH_B = 0x2222222222222222222222222222222222222222222222222222222222222222;

    event Sealed(bytes32 indexed proofHash, address indexed signer, uint256 timestamp);

    function setUp() public {
        kairon = new Kairon();
    }

    function test_SealEmitsEvent() public {
        vm.expectEmit(true, true, false, true, address(kairon));
        emit Sealed(HASH_A, address(this), block.timestamp);
        kairon.seal(HASH_A);
    }

    function test_SealManyEmitsOnePerHash() public {
        bytes32[] memory hashes = new bytes32[](2);
        hashes[0] = HASH_A;
        hashes[1] = HASH_B;

        vm.expectEmit(true, true, false, true, address(kairon));
        emit Sealed(HASH_A, address(this), block.timestamp);
        vm.expectEmit(true, true, false, true, address(kairon));
        emit Sealed(HASH_B, address(this), block.timestamp);

        kairon.sealMany(hashes);
    }

    function test_SealGasUnder60k() public {
        uint256 gasBefore = gasleft();
        kairon.seal(HASH_A);
        uint256 gasUsed = gasBefore - gasleft();
        assertLt(gasUsed, 60_000, "seal should stay under 60k gas");
    }

    function test_SealManyCheaperThanNSeparateSeals() public {
        bytes32[] memory hashes = new bytes32[](5);
        for (uint256 i = 0; i < 5; i++) {
            hashes[i] = keccak256(abi.encodePacked(i));
        }
        uint256 gasBefore = gasleft();
        kairon.sealMany(hashes);
        uint256 gasUsed = gasBefore - gasleft();
        assertLt(gasUsed, 60_000 * 5);
    }

    function testFuzz_SealAcceptsAnyHash(bytes32 h) public {
        vm.expectEmit(true, true, false, true, address(kairon));
        emit Sealed(h, address(this), block.timestamp);
        kairon.seal(h);
    }
}
