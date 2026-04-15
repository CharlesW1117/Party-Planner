//constants//
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2602-CHARLES"; //should use your cohort and name
const RESOURCE = "/events"; // the events tab from the url in const BASE
const API = BASE + COHORT + RESOURCE; // all three put together

//state
let parties = []; //state is here to hold all my app's memory, when this changes the screen re-renders.//
let selectedParty = null;
 //whichever party the user clicks. null because nothing has been select.
//you can also use let selectedParies:

//Calls the API; Waits for the response; Turns it into JavaScript; Stores it in state; Handles errors if something goes wrong
async function getParties() {
  //created a function called getParties
  try {
    //tries to pull the API data define above
    const response = await fetch(API);
    const result = await response.json(); //once it gets a response, it converts it into Javascript
    parties = result.data; // we are calling the data that was pulled fromt he API parties
    render(); //we say render because we want the data to show when it arrives
  } catch (e) {
    //prevents crashing if error happens
    console.error(e);
  }
}

async function getParty(id) {
  try {
    const response = await fetch(API + "/" + id);
    const result = await response.json();
    selectedParty = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

function PartyListItem(party) {
  //This is for one clickable item
  const li = document.createElement("li");
  li.innerHTML = `
    <a href="#selected">${party.name}</a>
  `;
  li.addEventListener("click", () => getParty(party.id)); // get the party details when clicked
  return li;
}

function PartyList() {                      //this builds the whole list
  const ul = document.createElement("ul"); //this will hold all li items 
  ul.classList.add("party-list");

  const items = parties.map(PartyListItem); // turns each item into a part of the party list.
  ul.replaceChildren(...items); //replace the inside of ul with all the items. ... means to spread the array into individual elements.

  return ul;
}

function PartyDetails() {
  if (!selectedParty) {                       //if nothing is selected, undefined, empty, or null
    const p = document.createElement("p");    
    p.textContent = "Please select a party to see details.";
  return p;                                   // this message will appear before the user selects anything
  }

  const section = document.createElement("section"); //creates a section element and gives it a css class
  section.classList.add("party");
//uses template (${}) to insert the data.
  section.innerHTML = `
    <h3>${selectedParty.name} #${selectedParty.id}</h3> 
    <p>Date: ${selectedParty.date}</p>
    <p>Location: ${selectedParty.location}</p>
    <p>${selectedParty.description}</p>
  `;
  return section;                             //returns the finished sections
}

function render() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <PartyList></PartyList>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <PartyDetails></PartyDetails>
      </section>
    </main>
  `;

  app.querySelector("PartyList").replaceWith(PartyList());
  app.querySelector("PartyDetails").replaceWith(PartyDetails());
}
async function init() {
  await getParties();
  render();
}

init();
