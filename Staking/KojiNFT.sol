//Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol"; 
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Storage.sol"; 

///
/// @dev Interface for the NFT Royalty Standard
///
interface IERC2981 is IERC165 {
    /// ERC165 bytes to add to interface array - set in parent contract
    /// implementing this standard
    ///
    /// @notice Called with the sale price to determine how much royalty
    //          is owed and to whom.
    /// @param _tokenId - the NFT asset queried for royalty information
    /// @param _salePrice - the sale price of the NFT asset specified by _tokenId
    /// @return receiver - address of who should be sent the royalty payment
    /// @return royaltyAmount - the royalty payment amount for _salePrice   

    /// @notice Informs callers that this contract supports ERC2981
    /// @dev If `_registerInterface(_INTERFACE_ID_ERC2981)` is called
    ///      in the initializer, this should be automatic
    /// @param interfaceID The interface identifier, as specified in ERC-165
    /// @return `true` if the contract implements
    ///         `_INTERFACE_ID_ERC2981` and `false` otherwise
    function supportsInterface(bytes4 interfaceID) external override view returns (bool);
}

// Allows authorized users to add creators/infuencer addresses to the whitelist
contract Whitelisted is Ownable {

    mapping(address => bool) public whitelisted;

    modifier onlyWhitelisted() {
        require(whitelisted[_msgSender()] || owner() == address(_msgSender()));
        _;
    }

    function addWhitelisted(address _toAdd) onlyOwner public {
        require(_toAdd != address(0));
        whitelisted[_toAdd] = true;
    }

    function removeWhitelisted(address _toRemove) onlyOwner public {
        require(_toRemove != address(0));
        require(_toRemove != address(_msgSender()));
        whitelisted[_toRemove] = false;
    }

}

contract KojiNFT is ERC721Enumerable, ERC165Storage, Ownable, Whitelisted {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter private _tokenIds;
    Counters.Counter private _tier1tokenIds;
    Counters.Counter private _tier2tokenIds;

    struct NFTInfo {
        string collectionName; // Name of nft creator/influencer/artist
        string nftName; // Name of the actual NFT artwork
        string tier1uri; //address of NFT metadata
        string tier2uri; //address of NFT metadata
        uint256 timestart; //start time of release window
        uint256 timeend; //end time of release window
        bool redeemable; //can be redeemed
        bool exists;
    }

    mapping(uint256 => NFTInfo) public nftInfo; // Info of each NFT artist/infuencer wallet.
    mapping(uint256 => mapping(address => mapping(uint256 => bool))) public nftTierMinted; //nftTierMinted[_nftID][recipient][tier#]
    mapping (uint256 => mapping(uint => uint256)) public mintTotals; //mintTotals[_nftID][tier#]
    mapping (string => uint256) public mintTotalsURI; //mintTotalsURI[_nftID][URI]

    uint royaltyNumerator = 1;

    address public receiver = 0xb629Fb3426877640C6fB6734360D81D719062bF6; //KOJI charity address
    address public stakingContract;

    /*
     *     bytes4(keccak256('balanceOf(address)')) == 0x70a08231
     *     bytes4(keccak256('ownerOf(uint256)')) == 0x6352211e
     *     bytes4(keccak256('approve(address,uint256)')) == 0x095ea7b3
     *     bytes4(keccak256('getApproved(uint256)')) == 0x081812fc
     *     bytes4(keccak256('setApprovalForAll(address,bool)')) == 0xa22cb465
     *     bytes4(keccak256('isApprovedForAll(address,address)')) == 0xe985e9c5
     *     bytes4(keccak256('transferFrom(address,address,uint256)')) == 0x23b872dd
     *     bytes4(keccak256('safeTransferFrom(address,address,uint256)')) == 0x42842e0e
     *     bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)')) == 0xb88d4fde
     *
     *     => 0x70a08231 ^ 0x6352211e ^ 0x095ea7b3 ^ 0x081812fc ^
     *        0xa22cb465 ^ 0xe985e9c5 ^ 0x23b872dd ^ 0x42842e0e ^ 0xb88d4fde == 0x80ac58cd
     */
    bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;

    /*
     *     bytes4(keccak256('name()')) == 0x06fdde03
     *     bytes4(keccak256('symbol()')) == 0x95d89b41
     *     bytes4(keccak256('tokenURI(uint256)')) == 0xc87b56dd
     *
     *     => 0x06fdde03 ^ 0x95d89b41 ^ 0xc87b56dd == 0x5b5e139f
     */
    bytes4 private constant _INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;

    /*
     *     bytes4(keccak256('totalSupply()')) == 0x18160ddd
     *     bytes4(keccak256('tokenOfOwnerByIndex(address,uint256)')) == 0x2f745c59
     *     bytes4(keccak256('tokenByIndex(uint256)')) == 0x4f6ccce7
     *
     *     => 0x18160ddd ^ 0x2f745c59 ^ 0x4f6ccce7 == 0x780e9d63
     */
    bytes4 private constant _INTERFACE_ID_ERC721_ENUMERABLE = 0x780e9d63;

    /*
    *      bytes4(keccak256("royaltyInfo(uint256,uint256)")) == 0x2a55205a
    *      bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;
    *      _registerInterface(_INTERFACE_ID_ERC2981);
    *
    */

    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    constructor() ERC721("KojiNFT", "KOJINFT") {
        // register the supported interfaces to conform to ERC721 via ERC165
        _registerInterface(_INTERFACE_ID_ERC721);
        _registerInterface(_INTERFACE_ID_ERC721_METADATA);
        _registerInterface(_INTERFACE_ID_ERC721_ENUMERABLE);
        // Royalties interface
        _registerInterface(_INTERFACE_ID_ERC2981);

    }

    function mintNFT(address recipient, uint256 minttier, uint256 id) public returns (uint256) {   

        if(!whitelisted[address(recipient)]) {

            require(msg.sender == address(stakingContract), "Minting not allowed outside of the staking contract");
        }       

        NFTInfo storage nft = nftInfo[id];
        uint256 minted;

        _tokenIds.increment();
        
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);

        //mint the appropriate tier based on variable passed in from staking
        if(minttier == 1) {
            _setTokenURI(newItemId, nft.tier1uri);
             _tier1tokenIds.increment();
             minted = mintTotalsURI[nft.tier1uri];
             mintTotalsURI[nft.tier1uri] = minted.add(1);
        } else {
            _setTokenURI(newItemId, nft.tier2uri);
             _tier2tokenIds.increment();
             minted = mintTotalsURI[nft.tier2uri];
             mintTotalsURI[nft.tier2uri] = minted.add(1);
        }
        
        //record this NFT & tier as being minted by the recipient
        nftTierMinted[id][recipient][minttier] = true;

        //increment total # of NFT minted for this ID/Tier
        minted = mintTotals[id][minttier];
        mintTotals[id][minttier] = minted.add(1);

        return newItemId;

    }


    //returns the gloabal total number of minted NFT per tier
    function totalMinted() public view returns (uint256) {
        uint256 tier1 = _tier1tokenIds.current();
        uint256 tier2 = _tier2tokenIds.current();
        uint256 total = tier1.add(tier2);
        return total;
    }

    //returns the number of mints for each specific NFT based on URI
    function mintedCounttier(string memory tokenURI) public view returns (uint256) {
        return mintTotalsURI[tokenURI];
    }

    function royaltyInfo(uint256 _tokenId, uint256 _salePrice) external view returns(address,uint256){
    
    uint256 royaltyAmount = _salePrice.mul(royaltyNumerator).div(100);
    _tokenId = _tokenId;

    return (receiver, royaltyAmount);
        
    }

    function changeReceiver(address _receiver) external onlyOwner {
        receiver = _receiver;
    }

    function setstakingContract(address _address) external onlyOwner {
        stakingContract = _address;
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

    function getRoyaltyNumerator() external view returns(uint) {
        return royaltyNumerator;
    }

    function setRoyaltyNumerator(uint _number) external onlyOwner {
        require(_number >= 1 && _number <= 10, "Royalty fee must be no less than 1% and no greater than 10%");
        royaltyNumerator = _number;
    } 

    //function to change/add/remove NFT struct

    //function to change individual struct properties

    //function to read individual struct properties

}
