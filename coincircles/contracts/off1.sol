// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract CoinCircles {
    uint256 chamaIds;

    struct User {
        address wallet_address;
        bool isConnected;
    }
    struct UserProfile {
        address userAddress;
        mapping(uint256 => ChamaDetails) chamas;
        uint256[] amountsReceived;
    }

   

    struct Voting {
        bool isActive;
        mapping(address => bool) votes;
        uint256 totalVotes;
        address recipient;
    }

    struct Chama {
        string name;
        uint256 maxNoOfPeople;
        bool isFull;
        ChamaVisibility visibility;
        mapping(address => bool) members;
        address[] listOfMembers;
        address owner;
        uint256 targetAmountPerRound;
        uint256 totalContribution;
        uint256 numberOfRounds;
        uint256 minimumNoOfPeople;
        address[] hasContributed;
        mapping(address => mapping(uint256 => uint256)) contributionsPerRound;
        bool hasContributionStarted;
        uint256 currentRound;
    }
    struct ChamaDetails {
        string name;
        uint256 maxNoOfPeople;
        bool isFull;
        ChamaVisibility visibility;
        address[] listOfMembers;
        address owner;
        uint256 targetAmountPerRound;
        uint256 totalContribution;
        uint256 numberOfRounds;
        uint256 minimumNoOfPeople;
        bool hasContributionStarted;
        uint256 currentRound;
    }


    enum ChamaVisibility {
        Public,
        Private
    }

    mapping(address => User) public users;
    mapping(uint256 => Chama) public chamas;
    mapping(address => mapping(uint256 => bool)) public hasContributed;
    mapping(uint256 => Voting) public votings;
    mapping(uint256 => mapping(address => bool)) public fundsReceivedInRound;
    mapping(uint256 => mapping(address => uint256)) public totalAmountReceivedByMember;
    mapping(address => UserProfile) public userProfiles;

    mapping(uint256 => address[]) public contributorsInCurrentRound;

    event UserConnected(address wallet_address);
    event ChamaCreated(uint256 chamaIds, string name);
    event UserJoinedChama(string name, address user_address);
    event MemberAddedToPrivateChama(string chamaName, address newMember);
    event FundsDistributed(string chamaName, address recipient, uint256 amount);
    // event FundsReceived(string chamaName, address recipient, uint256 amountReceived);
    event FundsReceived(string chamaName, address recipient, uint256 amountReceived, uint256 round);

    event ContributionMade(string name, address user_address, uint256 amount);
    event VotingStarted(string name, address recipient);
    event VoteCast(string name, address voter, address recipient);

    function connect_user() public {
        require(!users[msg.sender].isConnected, "User is already connected");
        users[msg.sender] = User({
            wallet_address: msg.sender,
            isConnected: true
        });
        emit UserConnected(msg.sender);
    }

    function create_chama(string memory _name, uint256 _maxNoOfPeople, ChamaVisibility _visibility, uint256 _minimumNoOfPeople, uint256 _targetAmountPerRound) public validateMinMax(_maxNoOfPeople, _minimumNoOfPeople){
        require(users[msg.sender].isConnected, "User is not connected");
        require(_maxNoOfPeople >= 2, "Chama should have at least two members");
        require(bytes(_name).length > 0, "The length of the name should not be empty");

        for (uint256 i = 0; i < chamaIds; i++) {
            require(keccak256(bytes(chamas[i].name)) != keccak256(bytes(_name)), "A chama with this name already exists");
        }

        Chama storage new_chama = chamas[chamaIds];
        new_chama.name = _name;
        new_chama.maxNoOfPeople = _maxNoOfPeople;
        new_chama.isFull = false;
        new_chama.visibility = _visibility;
        new_chama.owner = msg.sender;
        new_chama.targetAmountPerRound = _targetAmountPerRound;
        new_chama.totalContribution = 0;
        new_chama.minimumNoOfPeople = _minimumNoOfPeople;
        new_chama.hasContributionStarted = false;
        new_chama.numberOfRounds = new_chama.listOfMembers.length;
        new_chama.currentRound = 0;
        chamaIds++;
        new_chama.members[msg.sender] = true;
        new_chama.listOfMembers.push(msg.sender);
        emit ChamaCreated(chamaIds - 1, _name);
    }

    function join_chama(string memory _name) public {
        uint256 chamaId = getChamaId(_name);
        require(users[msg.sender].isConnected, "User is not connected");
        require(chamaExists(_name), "Chama does not exist");
        require(!isMember(_name, msg.sender), "You cannot join a chama twice");
        require(!checkChamaIsFull(_name), "Chama is full");
        require(chamas[chamaId].visibility != ChamaVisibility.Private, "Private Chamas cannot be joined directly");
        require(!chamas[chamaId].hasContributionStarted, "Contributions have already started, no new members can be added");

        chamas[chamaId].members[msg.sender] = true;
        chamas[chamaId].listOfMembers.push(msg.sender);
        chamas[chamaId].numberOfRounds = chamas[chamaId].listOfMembers.length;
        if (chamas[chamaId].listOfMembers.length == chamas[chamaId].maxNoOfPeople) {
            chamas[chamaId].isFull = true;
        }
        emit UserJoinedChama(_name, msg.sender);
    }

    function add_members_to_privatechama(string memory _name, address new_member) public {
        require(chamaExists(_name), "Chama does not exist");
        uint256 chamaId = getChamaId(_name);
        require(chamas[chamaId].visibility == ChamaVisibility.Private, "Only private Chamas can have members added");
        require(chamas[chamaId].owner == msg.sender, "Only the owner can add members to this private Chama");
        require(!chamas[chamaId].members[new_member], "User is already a member of this chama");
        require(!chamas[chamaId].hasContributionStarted, "Contributions have already started, no new members can be added");

        chamas[chamaId].members[new_member] = true;
        chamas[chamaId].listOfMembers.push(new_member);
        if (chamas[chamaId].listOfMembers.length == chamas[chamaId].maxNoOfPeople) {
            chamas[chamaId].isFull = true;
        }
        emit MemberAddedToPrivateChama(_name, new_member);
    }
    function getContributionAmount(string memory _name) public view returns (uint256) {
        uint256 chamaId = getChamaId(_name);
        uint256 userContribution = chamas[chamaId].targetAmountPerRound / chamas[chamaId].listOfMembers.length;
        return userContribution;
    }

    function isMinimumNumberOfPeopleReached(string memory _name) public view returns (bool) {
        uint256 chamaId = getChamaId(_name);
        return chamas[chamaId].listOfMembers.length >= chamas[chamaId].minimumNoOfPeople;
    }

    modifier validateMinMax(uint256 _maxNoOfPeople, uint256 _minimumNoOfPeople) {
        require(_maxNoOfPeople >= _minimumNoOfPeople, "Maximum number of people should be greater than or equal to the minimum");
        _;
    }



    function startVoting(string memory _name) internal {
        uint256 chamaId = getChamaId(_name);
        Voting storage voting = votings[chamaId];

        voting.isActive = true;
        voting.totalVotes = 0;

        // Reset the votes mapping for the new round
        for (uint256 i = 0; i < chamas[chamaId].listOfMembers.length; i++) {
            voting.votes[chamas[chamaId].listOfMembers[i]] = false;
        }

        // Set the recipient based on the getCurrentRecipient function
        voting.recipient = getCurrentRecipient(_name);

        // Emit VotingStarted event after recipient address is set
        emit VotingStarted(_name, voting.recipient);
        }

    function voteForRecipient(string memory _name) public {
        uint256 chamaId = getChamaId(_name);
        require(chamaExists(_name), "Chama does not exist");
        require(isMember(_name, msg.sender), "User is not a member of this chama");
        Voting storage voting = votings[chamaId];
        require(voting.isActive, "Voting is not active");
        require(!voting.votes[msg.sender], "User has already voted");

        // Set the recipient based on the getCurrentRecipient function
        voting.recipient = getCurrentRecipient(_name);

        // Record the vote
        voting.votes[msg.sender] = true;
        voting.totalVotes++;

        emit VoteCast(_name, msg.sender, voting.recipient);

        if (voting.totalVotes == chamas[chamaId].listOfMembers.length) {
            distributeFunds(_name);
        }
    }

    
    function contributeFunds(string memory _name) public payable {
        require(users[msg.sender].isConnected, "User must be connected");
        require(chamaExists(_name), "Chama does not exist");
        uint256 chamaId = getChamaId(_name);
        require(isMember(_name, msg.sender), "User is not a member of this chama");
        require(chamas[chamaId].listOfMembers.length >= chamas[chamaId].minimumNoOfPeople, "The minimum number of people required to start contribution has not been reached");
        require(!hasContributedInCurrentRound(chamaId, msg.sender), "You have already contributed in the current round");
        require(chamas[chamaId].currentRound <= chamas[chamaId].numberOfRounds, "Chama has ended, no more contributions allowed");

        if (!chamas[chamaId].hasContributionStarted) {
            chamas[chamaId].currentRound = 1;
            chamas[chamaId].hasContributionStarted = true;
        }

        uint256 userContribution = chamas[chamaId].targetAmountPerRound / chamas[chamaId].listOfMembers.length;
        require(msg.value > 0 && msg.value >= userContribution, "Enter a valid number or a number that equals or exceeds your correct contribution");

        chamas[chamaId].contributionsPerRound[msg.sender][chamas[chamaId].currentRound] += msg.value;
        chamas[chamaId].totalContribution += msg.value;

        hasContributed[msg.sender][chamas[chamaId].currentRound] = true;
        contributorsInCurrentRound[chamaId].push(msg.sender);

        emit ContributionMade(_name, msg.sender, msg.value);

        if (contributorsInCurrentRound[chamaId].length == chamas[chamaId].listOfMembers.length) {
            startVoting(_name);
        }
    }

    function distributeFunds(string memory _name) internal {
        uint256 chamaId = getChamaId(_name);
        require(votings[chamaId].isActive, "Voting is not active");
        require(allMembersContributedInCurrentRound(_name), "All members have not contributed in the current round");

        Voting storage voting = votings[chamaId];
        uint256 amountToDistribute = chamas[chamaId].totalContribution;
        chamas[chamaId].totalContribution = 0;

        require(amountToDistribute > 0, "Insufficient funds to distribute");

        // Reset currentRound if numberOfRounds has been reached
        if (chamas[chamaId].currentRound >= chamas[chamaId].numberOfRounds) {
            chamas[chamaId].currentRound = 0;
        }

        // for (uint256 i = 0; i < chamas[chamaId].listOfMembers.length; i++) {
        //     hasContributed[chamas[chamaId].listOfMembers[i]][chamas[chamaId].currentRound] = false;
        // }

        // Clear the contributorsInCurrentRound array
        delete contributorsInCurrentRound[chamaId];

        chamas[chamaId].currentRound++;
        votings[chamaId].isActive = false;

        address payable recipient = payable(voting.recipient);

        // Update the total amount received by the recipient in this chama
        totalAmountReceivedByMember[chamaId][recipient] += amountToDistribute;

        // Mark the recipient as having received funds in the current round
        fundsReceivedInRound[chamaId][recipient] = true;

        // Attempt to send the funds and handle the failure case
        (bool success, ) = recipient.call{value: amountToDistribute, gas: gasleft()}("");
        require(success, "Transfer failed: recipient may not be able to receive funds or out of gas");

        emit FundsDistributed(_name, recipient, amountToDistribute);
        emit FundsReceived(_name, recipient, amountToDistribute, chamas[chamaId].currentRound - 1);
    }

// New function to retrieve the chamas a user is part of and the total amount they have received in each chama
    function getMemberChamasAndAmountReceived(address _member) public view returns (string[] memory chamaNames, uint256[] memory amountsReceived) {
        uint256 chamaCount = 0;
        for (uint256 i = 0; i < chamaIds; i++) {
            if (chamas[i].members[_member]) {
                chamaCount++;
            }
        }

    chamaNames = new string[](chamaCount);
    amountsReceived = new uint256[](chamaCount);

    uint256 index = 0;
    for (uint256 i = 0; i < chamaIds; i++) {
        if (chamas[i].members[_member]) {
            chamaNames[index] = chamas[i].name;
            amountsReceived[index] = totalAmountReceivedByMember[i][_member];
            index++;
        }
    }
}
    



    function getChamaId(string memory _name) internal view returns (uint256) {
        for (uint256 i = 0; i < chamaIds; i++) {
            if (keccak256(bytes(chamas[i].name)) == keccak256(bytes(_name))) {
                return i;
            }
        }
        revert("Chama not found");
    }

    function isMember(string memory _name, address _userAddress) public view returns (bool) {
        uint256 chamaId = getChamaId(_name);
        return chamas[chamaId].members[_userAddress];
    }

    function allMembersContributedInCurrentRound(string memory _name) public view returns (bool) {
        uint256 chamaId = getChamaId(_name);
        for (uint256 i = 0; i < chamas[chamaId].listOfMembers.length; i++) {
            if (!hasContributed[chamas[chamaId].listOfMembers[i]][chamas[chamaId].currentRound]) {
                return false;
            }
        }
        return true;
    }

   
    function hasContributedInCurrentRound(uint256 chamaId, address member) public view returns (bool) {
    return chamas[chamaId].contributionsPerRound[member][chamas[chamaId].currentRound] > 0;
    }

    function chamaExists(string memory _name) internal view returns (bool) {
        for (uint256 i = 0; i < chamaIds; i++) {
            if (keccak256(bytes(chamas[i].name)) == keccak256(bytes(_name))) {
                return true;
            }
        }
        return false;
    }

    function checkChamaIsFull(string memory _name) internal view returns (bool) {
        uint256 chamaId = getChamaId(_name);
        return chamas[chamaId].isFull;
    }

   
    // New function to get the list of possible recipients for voting
    function getPossibleRecipients(string memory _name) public view returns (address[] memory) {
        require(chamaExists(_name), "Chama does not exist");
        uint256 chamaId = getChamaId(_name);
        return chamas[chamaId].listOfMembers;
    }
    function getCurrentRecipient(string memory _name) public view returns (address) {
        uint256 chamaId = getChamaId(_name);
        require(chamaExists(_name), "Chama does not exist");
        require(chamas[chamaId].hasContributionStarted, "Contributions have not started yet");

        // Calculate the recipient index based on the current round
        uint256 recipientIndex = (chamas[chamaId].currentRound - 1) % chamas[chamaId].listOfMembers.length;
        return chamas[chamaId].listOfMembers[recipientIndex];
    }
  
    function getAllChamas() public view returns (ChamaDetails[] memory) {
    ChamaDetails[] memory allChamaDetails = new ChamaDetails[](chamaIds);
    for (uint256 i = 0; i < chamaIds; i++) {
        Chama storage chama = chamas[i];
        allChamaDetails[i] = ChamaDetails({
            name: chama.name,
            maxNoOfPeople: chama.maxNoOfPeople,
            isFull: chama.isFull,
            visibility: chama.visibility,
            listOfMembers: chama.listOfMembers,
            owner: chama.owner,
            targetAmountPerRound: chama.targetAmountPerRound,
            totalContribution: chama.totalContribution,
            numberOfRounds: chama.numberOfRounds,
            minimumNoOfPeople: chama.minimumNoOfPeople,
            hasContributionStarted: chama.hasContributionStarted,
            currentRound: chama.currentRound
        });
    }
    return allChamaDetails;
    }
    function getUserProfile(address _userAddress) internal returns (UserProfile storage) {
        UserProfile storage profile = userProfiles[_userAddress];
        
        if (profile.userAddress == address(0)) {
            // Initialize the profile if it doesn't exist
            profile.userAddress = _userAddress;
            
            uint256 chamaCount = 0;
            for (uint256 i = 0; i < chamaIds; i++) {
                if (chamas[i].members[_userAddress]) {
                    chamaCount++;
                }
            }
            
            profile.amountsReceived = new uint256[](chamaCount);
            
            uint256 index = 0;
            for (uint256 i = 0; i < chamaIds; i++) {
                if (chamas[i].members[_userAddress]) {
                    profile.chamas[index] = ChamaDetails({
                        name: chamas[i].name,
                        maxNoOfPeople: chamas[i].maxNoOfPeople,
                        isFull: chamas[i].isFull,
                        visibility: chamas[i].visibility,
                        listOfMembers: chamas[i].listOfMembers,
                        owner: chamas[i].owner,
                        targetAmountPerRound: chamas[i].targetAmountPerRound,
                        totalContribution: chamas[i].totalContribution,
                        numberOfRounds: chamas[i].numberOfRounds,
                        minimumNoOfPeople: chamas[i].minimumNoOfPeople,
                        hasContributionStarted: chamas[i].hasContributionStarted,
                        currentRound: chamas[i].currentRound
                    });
                    profile.amountsReceived[index] = totalAmountReceivedByMember[i][_userAddress];
                    index++;
                }
            }
        }
        
        return profile;
    }
    function getUserProfileDetails(address _userAddress) public view returns (string[] memory chamaNames, uint256[] memory amountsReceived) {
    UserProfile storage profile = userProfiles[_userAddress];
    
    uint256 chamaCount = 0;
    for (uint256 i = 0; i < chamaIds; i++) {
        if (chamas[i].members[_userAddress]) {
            chamaCount++;
        }
    }
    
    chamaNames = new string[](chamaCount);
    amountsReceived = new uint256[](chamaCount);
    
    uint256 index = 0;
    for (uint256 i = 0; i < chamaIds; i++) {
        if (chamas[i].members[_userAddress]) {
            chamaNames[index] = chamas[i].name;
            amountsReceived[index] = totalAmountReceivedByMember[i][_userAddress];
            index++;
        }
    }
}



}