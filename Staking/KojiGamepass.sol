//Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol"; 
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IAuth {
    function isAuthorized(address _address) external view returns (bool);
    function DEAD() external view returns (address);
    function getKojiOracle() external view returns (address);
}

// Interface for the Koji Oracle
interface IOracle {
 function getbnbusdequivalent(uint256 amount) external view returns (uint256);
}

contract KojiGamepass is ERC721URIStorage, ERC165, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    modifier onlyAuthorized() {
        require(IAuth(AUTH).isAuthorized(_msgSender()) || owner() == address(_msgSender()), "User not Authorized to NFT Contract");
        _;
    }

    Counters.Counter private _tokenIds;

    uint public mintFee = 1;

    string URI;

    IAuth private auth;
    IOracle private oracle;

    address  AUTH;
    address  DEAD;
    address  ORACLE; 

    constructor(address _auth, string memory _uri) ERC721("KojiGamepass", "SPACEWARSv1") { 

        AUTH = _auth;
        auth = IAuth(AUTH);

        DEAD = auth.DEAD();
        ORACLE = auth.getKojiOracle(); 
        oracle = IOracle(ORACLE);

        URI = _uri;
    }

    receive() external payable {}

    function mintGamepass(string memory _holder) external payable nonReentrant {

        uint mintCost = oracle.getbnbusdequivalent(mintFee);

        require(compareHashes(_msgSender(), _holder), "Sender is not the same as requested recipient");
        require(IERC721(this).balanceOf(_msgSender()) == 0, "You already possess a Koji Gamepass NFT");
        require(msg.value >= mintCost, "Please include mint fee in order to mint Koji Gamepass NFT");

        _tokenIds.increment();
        
        uint256 newItemId = _tokenIds.current();

        _mint(_msgSender(), newItemId);

        string memory metadata = _holder;
        string memory json = ".json";        
        string memory result = string.concat(metadata, json);

        _setTokenURI(newItemId, string.concat(URI, result));

    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override{
        require(ERC721.ownerOf(tokenId) == from, "ERC721: transfer of token that is not owned");
        require(to == address(DEAD), "ERC721: transfer must be to the zero address");

        _beforeTokenTransfer(from, to, tokenId);

        // Clear approvals from the previous owner
        _approve(address(0), tokenId);

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }


    // This will allow to rescue ETH sent by mistake directly to the contract
    function rescueETHFromContract() external onlyOwner {
        address payable _owner = payable(_msgSender());
        _owner.transfer(address(this).balance);
    }

    // Function to allow admin to claim *other* ERC20 tokens sent to this contract (by mistake)
    function transferERC20Tokens(address _tokenAddr, address _to, uint _amount) public onlyOwner {
       
        IERC20(_tokenAddr).transfer(_to, _amount);
    }

    function getMintCost() external view returns(uint) {
        return oracle.getbnbusdequivalent(mintFee);
    }

    function changeMintFee(uint _fee) external onlyAuthorized {
        mintFee = _fee;
    }

    function compareHashes(address _address, string memory _holder) internal pure returns (bool) {

        bytes32 first = keccak256(bytes(Strings.toHexString(uint160(_address), 20)));

        bytes32 second = keccak256(bytes(_toLower(_holder)));

        return(first == second);
    }

    function _toLower(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint i = 0; i < bStr.length; i++) {
            // Uppercase character...
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                // So we add 32 to make it lowercase
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }
    
}
