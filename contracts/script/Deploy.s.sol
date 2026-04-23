// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {Kairon} from "../src/Kairon.sol";

contract Deploy is Script {
    function run() external returns (Kairon kairon) {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerKey);
        kairon = new Kairon();
        vm.stopBroadcast();

        console.log("Kairon deployed at:", address(kairon));
        console.log("Chain ID:", block.chainid);
    }
}
