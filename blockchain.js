function loadImagesOfMintedNfts() {
  for (let i = 1; i <= 10; i++) {
    if (localStorage.getItem(i.toString())) {
      console.log(`element with id ${i} is minted`);
      const nft1 = document.getElementById(i);
      const att = document.createAttribute("style");
      att.value = `content:url(./skins/${i}.png)`;
      nft1.setAttributeNode(att);
    }
  }
}

// Function called when you want to select an NFT skin or mint one

async function mintOrSelect(element) {
  if (signer == undefined) {
    alert("Connect MetaMask.");
  }
  if (window.nftScore < 1) {
    alert("Collect NFTs to mint!");
    return;
  }
  const skinsContractAddress = "0xb765FB812d36389d9AE0fA2A75470E1D3a0537F0"; // Update contract address if you deployed a new one and want to try your deployed smart contract
  const skinsCollectionAbi = [
    "function mint(string memory tokenURI) public returns (uint256)",
  ];
  const skinsContract = new ethers.Contract(
    skinsContractAddress,
    skinsCollectionAbi,
    provider
  );

  if (localStorage.getItem(element.id) == null) {
    const cidOfJsonFiles = "QmYQYe65myBYcMpsT5B4Lp5N1LK7RYWKazBXi7Kb1MvWA9"; // Update the CID for the metadata if you have decided to change the skins for the game
    const tokenURI =
      `https://ipfs.io/ipfs/${cidOfJsonFiles}/` + element.id + ".json";
    const tx = await skinsContract.connect(signer).mint(tokenURI);
    await tx.wait();

    localStorage.setItem(element.id, 1);
    // minted an NFT...

    loadImagesOfMintedNfts();
  } else {
    //  selected an NFT as a skin...
    localStorage.setItem("currentSkin", `./skins/${element.id}.png`);
    alert('New skin applied!')
  }
}

let provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;

async function connectMetamask() {
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  console.log("Account address s:", await signer.getAddress());
}
