// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract Keyboards {

    enum KeyboardKind {
        SixtyPercent,
        SeventyFivePercent,
        Eightypercent,
        Iso105
    }

    struct KeyBoard {
        KeyboardKind kind;
        //ABS = false, PBT = true
        bool isPBT;
        string filter;
        address owner;
    }
    
    KeyBoard[] public createdKeyboards;

    function getKeyboards() view public returns(KeyBoard[] memory){
        return createdKeyboards;
    }

    function create(KeyboardKind _kind,bool _isPBT,string calldata _filter) external {
        KeyBoard memory newKeyboard = KeyBoard({
            kind: _kind,
            isPBT: _isPBT,
            filter: _filter,
            owner: msg.sender
        });
        createdKeyboards.push(newKeyboard);
    }
    function tip(uint256 _index) external payable  {
  address payable owner = payable(createdKeyboards[_index].owner);
  owner.transfer(msg.value);
}
}