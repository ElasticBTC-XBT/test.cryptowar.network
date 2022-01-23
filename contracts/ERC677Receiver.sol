pragma solidity ^0.6.2;

abstract contract ERC677Receiver {
    function onTokenTransfer(
        address _from,
        uint256 _value,
        bytes calldata _data
    ) external virtual returns (bool);
}
