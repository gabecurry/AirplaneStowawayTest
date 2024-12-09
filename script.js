let timeRemaining = 300;
let score = 0;
let hintCount = 0;
const maxHints = 4;
let correctSuspect = Math.floor(Math.random() * 8);
let currentClueIndex = 0;

const backstory = `
  During a routine international flight, chaos erupts when an announcement reveals a stowaway onboard. 
  Vital documents containing sensitive information are stolen from the captain's quarters, and the 
  aircraft's communication system is sabotaged. The passengers include a mix of influential, enigmatic, 
  and mysterious individuals, all with hidden motives. 

  As the lead investigator for the airline, you’ve been called in to piece together clues before landing. 
  The stowaway must be unmasked, and the stolen documents recovered before this flight’s reputation—and 
  safety—is irreparably damaged. But beware: everyone has something to hide, and only one is guilty of 
  orchestrating this high-altitude heist. 
`;

// Display backstory
document.getElementById("story").textContent = backstory;

// Suspects array
const suspects = [
  {
    name: "Lila Beaumont",
    backstory: "A famous actress traveling to promote her latest film, rumored to be a financial disaster. Publicly adored but privately plagued by scandals, including financial fraud. Her charm masks a ruthless streak known only to those closest to her.",
    clues: [
      "A silk scarf with her initials was found near the radio compartment.",
      "Smudged fingerprints on the stolen documents matched her manicured nails.",
      "Witnesses recall her disappearing for an unusually long time during the flight.",
      "A script with hand-written annotations about sabotage was found in her carry-on."
    ]
  },
  {
    name: "Marcus Kane",
    backstory: "A tech entrepreneur whose latest venture faced public backlash after a data breach. Claimed to be traveling for a retreat but was overheard making cryptic calls before boarding. His guarded nature adds to the suspicion.",
    clues: [
      "A pair of headphones with static interference was discovered under a seat.",
      "The captain saw him near the restricted area before the tampering was discovered.",
      "A fragment of a spa flyer with his name was found in the cockpit.",
      "His laptop contained drafts of threatening emails to competitors."
    ]
  },
  {
    name: "Serena Castillo",
    backstory: "An investigative journalist invited on the flight as a goodwill gesture. Known for writing exposés on corporate corruption, she’s rumored to be sitting on a career-defining scoop.",
    clues: [
      "Security footage shows her entering the cargo hold during turbulence.",
      "A flight attendant heard her muttering about 'taking down giants.'",
      "A torn notebook page with notes about 'insider betrayal' was found in the trash.",
      "Her press badge was left on the floor near the restricted area."
    ]
  },
  {
    name: "Elliot Faye",
    backstory: "A retired pilot with decades of experience, traveling to accept a lifetime achievement award. Despite his accolades, recent financial troubles have cast a shadow over his otherwise stellar reputation.",
    clues: [
      "A maintenance manual with circled notes was found in his seat pocket.",
      "A faint smell of aviation fuel clung to his jacket.",
      "A note addressed to 'Captain' was found in the stowaway’s belongings.",
      "His flight logbook had unauthorized entries."
    ]
  },
  {
    name: "Natalie Sharpe",
    backstory: "A high-profile attorney known for taking on controversial cases. Traveling to meet a mysterious client, her secretive behavior and whispered conversations with the cabin crew raised eyebrows.",
    clues: [
      "A briefcase with legal documents matching the stolen ones was in the overhead bin.",
      "Ink smudges on her hands matched the pen provided to the crew.",
      "A court ID badge was found near the cockpit.",
      "A torn business card with 'esq' was found in the cargo hold."
    ]
  },
  {
    name: "Victor Hayes",
    backstory: "A wealthy art dealer returning from a successful auction in Europe. His shady dealings and reputation for smuggling antiquities make him a controversial figure in elite circles.",
    clues: [
      "A receipt for 'custom adjustments' to his seat was found in his wallet.",
      "His gloves had traces of paint matching the cockpit door.",
      "Witnesses saw him carrying a suspiciously large bag when boarding.",
      "A small parcel from a local gallery was found in the cargo hold."
    ]
  },
  {
    name: "Amara Singh",
    backstory: "A neuroscientist attending a prestigious conference. Recently accused of falsifying data, her quiet demeanor hides fierce ambition and an apparent willingness to do whatever it takes to succeed.",
    clues: [
      "Her shoes had specks of metal consistent with the tampered panel.",
      "A sedative vial, used to calm passengers, was found in her handbag.",
      "A lab notebook with entries about aviation psychology was found near the radio compartment.",
      "She had filed a complaint about 'unusual noises' during the flight."
    ]
  },
  {
    name: "Dante Cruz",
    backstory: "A flight attendant with an impeccable record but whispers of a hidden criminal past. Often overly familiar with high-profile passengers, this flight was supposed to be his last before retirement.",
    clues: [
      "His uniform had an oil stain near the pocket.",
      "A crew keycard was found out of place.",
      "A witness saw him lingering near the stolen documents before takeoff.",
      "An unsigned note promising a 'new start' was tucked in his locker."
    ]
  }
];

const suspectsList = document.getElementById("suspects-list");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const hintText = document.getElementById("hint-text");
const endScreen = document.getElementById("end-screen");
const endMessage = document.getElementById("end-message");
const mainMenu = document.getElementById("game-container");
const suspectsPage = document.getElementById("suspects-page");
const suspectsButton = document.getElementById("suspects-button");
const backButton = document.getElementById("back-button");
const hintButton = document.getElementById("hint-button");

suspects.forEach((suspect, index) => {
  const suspectDiv = document.createElement("div");
  suspectDiv.classList.add("suspect");
  suspectDiv.innerHTML = `
    <h4>${suspect.name}</h4>
    <p>${suspect.backstory}</p>
    <button class="suspect-button" data-index="${index}">Accuse</button>
  `;
  suspectsList.appendChild(suspectDiv);
});

const timer = setInterval(() => {
  if (timeRemaining > 0) {
    timeRemaining--;
    timerDisplay.textContent = timeRemaining;
  } else {
    clearInterval(timer);
    endGame(false);
  }
}, 1000); // Corrected to a 1-second interval

suspectsButton.addEventListener("click", () => {
  mainMenu.classList.add("hidden");
  suspectsPage.classList.remove("hidden");
});

backButton.addEventListener("click", () => {
  suspectsPage.classList.add("hidden");
  mainMenu.classList.remove("hidden");
});

hintButton.addEventListener("click", () => {
  if (hintCount < maxHints) {
    const hint = suspects[correctSuspect].clues[currentClueIndex];
    hintText.textContent = `Hint ${hintCount + 1}: ${hint}`;
    currentClueIndex = (currentClueIndex + 1) % suspects[correctSuspect].clues.length;
    hintCount++;
    score -= 5;
    scoreDisplay.textContent = score;
  } else {
    hintText.textContent = "No more hints available!";
  }
});

document.querySelectorAll(".suspect-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    const suspectIndex = parseInt(event.target.dataset.index);
    if (suspectIndex === correctSuspect) {
      score += 15;
      endGame(true);
    } else {
      score -= 10;
      scoreDisplay.textContent = score;
      alert("Incorrect suspect! Try again.");
    }
  });
});

function endGame(won) {
  clearInterval(timer);
  mainMenu.classList.add("hidden");
  suspectsPage.classList.add("hidden");
  endScreen.classList.remove("hidden");
  const suspect = suspects[correctSuspect];
  endMessage.innerHTML = won
    ? `Congratulations! The accomplice was ${suspect.name}. Final Score: ${score}`
    : `Time's up! The accomplice was ${suspect.name}. Final Score: ${score}`;
}
