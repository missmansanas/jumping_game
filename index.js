const container = document.querySelector(".container")

let playerLeftSpace = 50
let startingPoint = 150
let playerBottomSpace = startingPoint
const player = document.getElementsByClassName("player")[0]

// Initializes the player position from the left and bottom of the screen

function createPlayer() {    
    player.classList.add("player")
    playerLeftSpace = grounds[0].left
    player.style.bottom = playerBottomSpace + "px"
    player.style.left = playerLeftSpace + "px"
}

// Constructor for spawning NFTs throughout the game

class NFT {
    constructor(newNftBottom) {
        this.bottom = newNftBottom
        this.left = Math.random() * 325
        this.visual = document.createElement("div")

        const visual = this.visual
        visual.classList.add("nft")
        visual.style.left = this.left + "px"
        visual.style.bottom = this.bottom + "px"
        container.appendChild(visual)
    }
}

// Constructor for spawning platforms throughout the game

class Ground {
    constructor(newGroundBottom) {
        this.bottom = newGroundBottom
        this.left = Math.random() * 325
        this.visual = document.createElement("div")

        const visual = this.visual
        visual.classList.add("ground")
        visual.style.left = this.left + "px"
        visual.style.bottom = this.bottom + "px"
        container.appendChild(visual)
    }
}

// Spawns 5 platforms on the screen at any given time

let groundCount = 5
let grounds = []
function createGround() {
    for(let i = 0; i < groundCount; i++) {
        let groundGap = 700 / groundCount
        let groundBottom = 100 + i * groundGap
        let ground = new Ground(groundBottom)
        grounds.push(ground)
    }
}

// Function that is called when the player "jumps"
// If the player is more than 200px from starting point, it begins to fall

let upTimerId
let downTimerId
function jump() {
    clearInterval(downTimerId)
    isJumping = true
    upTimerId = setInterval(() => {
        checkIfCollectNft()
        playerBottomSpace += 20
        player.style.bottom = playerBottomSpace + "px"
        if(playerBottomSpace > startingPoint + 200) {
            fall()
        }
    }, 30);
}

// Different functions are called when the player clicks left, right or up

function onKeyPress(event) {
    if(event.key === "ArrowLeft") {
        moveLeft()
    } else if(event.key === "ArrowRight") {
        moveRight()
    } else if(event.key === "ArrowUp") {
        stopMoving()
    }
}

let isGoingLeft
let isGoingRight
let leftTimerId
let rightTimerId

// Called when the player clicks left

function moveLeft() { 
    if(isGoingRight) {
        clearInterval(rightTimerId)
        isGoingRight = false
    }
    isGoingLeft = true
    leftTimerId = setInterval(() => {
        if(playerLeftSpace >= 0) {
            playerLeftSpace -= 5
            player.style.left = playerLeftSpace + "px"
        } else {
            moveRight()
        }
    }, 30);
}

// Called when the player clicks right

function moveRight() {
    if(isGoingLeft) {
        clearInterval(leftTimerId)
        isGoingLeft = false
    }
    isGoingRight = true
    rightTimerId = setInterval(() => {
        if(playerLeftSpace <= 450) {
            playerLeftSpace += 5
            player.style.left = playerLeftSpace + "px"
        } else {
            moveLeft()
        }
    }, 30);
}

// Called when the player clicks up

function stopMoving() {
    isGoingLeft = false
    isGoingRight = false
    clearInterval(rightTimerId)
    clearInterval(leftTimerId)
}

// Called automatically when the player hits a certain height
// When the player hits the bottom of the screen, the game ends

// If the player lands on a platform while falling, it jumps again

function fall() {
    clearInterval(upTimerId)
    isJumping = false
    downTimerId = setInterval(() => {
        playerBottomSpace -= 5
        player.style.bottom = playerBottomSpace + "px"
        if(playerBottomSpace <= 0) {
            endTheGame()
        }
        checkIfCollectNft()
        grounds.forEach(ground => {
            if(
                 (playerBottomSpace >= ground.bottom) &&
                 (playerBottomSpace <= ground.bottom + 15) &&
                 ((playerLeftSpace + 50) >= ground.left) &&
                (playerLeftSpace <= (ground.left + 75)) &&
                (!isJumping)
            ) {
                jump()
                startingPoint = playerBottomSpace

            }
        });
    }, 30);
}

// Tracks the collection of NFTs by bumping into them
// When an NFT is collected, a new one spawns 580px from the bottom

window.nftScore = 0
function checkIfCollectNft() {
    let nft = nfts[0]
    if(
        playerBottomSpace >= nft.bottom &&
        playerBottomSpace <= nft.bottom + 50 &&
        ((playerLeftSpace + 50) >= nft.left) &&
        playerLeftSpace <= nft.left + 50 
    ) {
        console.log("NFT collected!")
        window.nftScore += 1
        let nftOne = nfts[0].visual
        nftOne.classList.add('claimed')
        nftOne.addEventListener('animationend', ()=> {
            nftOne.classList.remove("nft")       
            nftOne.classList.remove("claimed")
        })
        nfts.shift()

        let newNFT = new NFT(580)
        nfts.push(newNFT)
    }
}

// Score elements

let score = 0 
let grid = document.getElementsByClassName("grid-container")[0]
let scoreElement = document.getElementById("score")
let nftScoreElement = document.getElementById("nftScore")

// Function that is called when the game ends
// Minted NFTs will be displayed, the platforms and player are removed, scores are updated and timers are cleared

function endTheGame() {
    isGameOver = true
    loadImagesOfMintedNfts()
    grounds.forEach(ground => {
        let groundOne = ground.visual
        groundOne.classList.remove("ground")
        
    })
    grounds = []
    nfts.forEach(nft => {
        let nftOne = nft.visual
        nftOne.classList.remove("nft")
    })
    player.classList.add("hide")
    grid.classList.remove("hide")
    scoreElement.innerText = "Score: " + score
    nftScoreElement.innerText = "NFT Score: " + window.nftScore
    
    
    clearInterval(upTimerId)
    clearInterval(downTimerId)
    clearInterval(rightTimerId)
    clearInterval(leftTimerId)
}

// Function for the moving platforms "animation"

function moveGrounds() {
    if(playerBottomSpace > 200) {
        grounds.forEach(ground => {
            ground.bottom -= 4
            let visual = ground.visual
            visual.style.bottom = ground.bottom + "px"

            if(ground.bottom < 10) {
                let groundOne = grounds[0].visual
                groundOne.classList.remove("ground")
                grounds.shift()
                let newGround = new Ground(700)
                grounds.push(newGround)
                
                score += 1
            }
        })
    } 
}

// Function for the moving NFTs "animation"

let nfts = [new NFT(500)]
function moveNFTs() {
    if(playerBottomSpace > 200) {
        nfts.forEach(nft => {
            nft.bottom -= 4
            let visual = nft.visual
            visual.style.bottom = nft.bottom + "px"
            
            if(nft.bottom < 10) {
                let nftOne = nfts[0].visual
                nftOne.classList.remove("nft")
                nfts.shift()

                let newNFT = new NFT(580)
                nfts.push(newNFT)
            }
        })
    } 
}

// Function called at the start of the game. Player jumps immediately and the document starts listening for keypresses

let isJumping

let isGameOver = false

function startGame() {
    if(!isGameOver) {
        createGround()
        createPlayer()
        setInterval(moveGrounds, 30);
        setInterval(moveNFTs, 30)
        jump()
        document.addEventListener("keydown", onKeyPress)
    }
}

startGame()

// Function called when it's time to display minted NFTs

function loadImagesOfMintedNfts() {
    for(let i = 1; i <= 10; i++) {
        if(localStorage.getItem(i.toString())) {
            console.log(`element with id ${i} is minted`)
            const nft1 = document.getElementById(i)
            const att = document.createAttribute("style");
            att.value = `content:url(./skins/${i}.jpg)`
            nft1.setAttributeNode(att);
        }
    }
}
