class Space {
    constructor(revealed = false, contents = " ", id = "spaceXXX") {
        this.Revealed = revealed;
        // The contents can either be " " or "M" which stand for an empty space and a mine respectively.
        this.Contents = contents;
        this.ID = id;
    }

    Reveal() {
        this.Revealed = true;
        if(this.Contents == "M") {
            // GAME OVER!!!
        }
        let spaceToChange = document.getElementById(this.ID);
        spaceToChange.style.backgroundColor = "#333";
        spaceToChange.classList.add("activated");
        spaceToChange.innerText = this.Contents;
    }

    ChangeID(newId) {
        this.ID = newId;
    }

    ChangeContents(newContents) {
        this.Contents = newContents;
    }
}

function InitialiseGrid(columns, rows) {
    // If there are already spaces in the grid, get rid of them.
    container.textContent = "";

    // Make a list of Space objects that will be returned at the end.
    spacesToReturn = [];

    // Make the grid now as wide and tall as the game grid should be. This is done by changing the variables declared in the CSS.
    container.style.setProperty("--gridColumns", columns);
    container.style.setProperty("--gridRows", rows);

    // Add as many spaces as required.
    // Keep a running total of the number of mines.
    minesNumber = 0;
    for (let spacesToAppend = 0; spacesToAppend < columns*rows; spacesToAppend++) {
        // Decide whether this space should be a mine or not. Let the initial probability of the space being a mine be 1/4. Then, if there's not already too many mines, then make it a mine (in other words, if 1/3 of the board is filled with mines, then don't add any more). Otherwise, make it an empty space.
        if(Math.floor(Math.random()*4) == 0 && minesNumber <= columns*rows/3) {
            spacesToReturn.push(new Space(false, "M"));
            minesNumber++;
        }
        else {
            spacesToReturn.push(new Space(false, " "));
        }
    }

    // Shuffle the array to make sure that there are no mines at the end of the array.
    spacesToReturn = Shuffle(spacesToReturn);

    return spacesToReturn;
}

function AddToGrid(spacesToAdd, columns, rows) {
    for(let currentSpaceNumber = 0; currentSpaceNumber < spacesToAdd.length; currentSpaceNumber++) {
        // The ID that'll be applied to the HTML element.
        newId = "space" + String(currentSpaceNumber);


        // Create a new space.
        let currentSpaceHTML = document.createElement("div");
        // Make its inner text be a number for now, this will be changed to either be blank, a number, a flag, a question mark, or a mine later on.
        currentSpaceHTML.innerText = ("");
        currentSpaceHTML.id = newId;
        
        // Change the style to an unrevealed space. 
        currentSpaceHTML.style.backgroundColor = "#555";

        // Change the ID of the current space object to the correct new ID.
        // The reason why the ID is set now and not earlier is that the fields are shuffled, so the correct number for the ID is different from before the shuffle.
        spacesToAdd[currentSpaceNumber].ChangeID(newId);

        // Actually append this created space onto the grid.
        container.appendChild(currentSpaceHTML).className = "spaces";
        
        // Add an event listener to trigger the appropriate function to reveal the space.
        currentSpaceHTML.addEventListener("click", () => {SpaceClick(spacesToAdd, currentSpaceNumber, columns, rows)});
        // Also add one to prevent the user from right-clicking (instead a mine will be set).
        currentSpaceHTML.addEventListener('contextmenu', e => e.preventDefault());
    }     
}

function SpaceClick(spaces, spacePosition, columns, rows) {
    // Check if the space is already revealed, in which case, do nothing.
    if(spaces[spacePosition].Revealed == true) return;

    if(firstMove == true) {
        // If it's the first move then the space that was clicked and all the adjacent ones must be blank. So that a space that isn't adjacent is accessed, several checks need to be made.

        // Check whether the space that was clicked is in the upper-left corner.
        if(spacePosition == 0) {
            // Change the space and the space to the right.
            spaces[spacePosition].ChangeContents(" ");
            spaces[spacePosition+1].ChangeContents(" ");
            // Change the space below and the one below-right.
            spaces[spacePosition+columns].ChangeContents(" ");
            spaces[spacePosition+columns+1].ChangeContents(" ");
        }
        // Check whether the space that was clicked is in the upper-right corner.
        else if(spacePosition == columns-1) {
            // Change the space and the space to the left.
            spaces[spacePosition].ChangeContents(" ");
            spaces[spacePosition-1].ChangeContents(" ");
            // Change the space below and the one below-left.
            spaces[spacePosition+columns].ChangeContents(" ");
            spaces[spacePosition+columns-1].ChangeContents(" ");
        }
        // Check whether the space that was clicked is in the lower-left corner.
        else if(spacePosition == rows*columns - columns) {
            // Change the space and the space to the right.
            spaces[spacePosition].ChangeContents(" ");
            spaces[spacePosition+1].ChangeContents(" ");
            // Change the space above and the one above-right
            spaces[spacePosition-columns].ChangeContents(" ");
            spaces[spacePosition-columns+1].ChangeContents(" ");
        }
        // Check whether the space that was clicked is in the lower-right corner.
        else if(spacePosition == rows*columns-1) {
            // Change the space and the space to the left.
            spaces[spacePosition].ChangeContents(" ");
            spaces[spacePosition-1].ChangeContents(" ");
            // Change the space above and the one above-left.
            spaces[spacePosition-columns].ChangeContents(" ");
            spaces[spacePosition-columns-1].ChangeContents(" ");
        }
        // Check whether the space that was clicked is on the top row.
        else if(Math.floor(spacePosition/columns) == 0) {
            // Change the space, the space to the left, and the space to the right.
            spaces[spacePosition].ChangeContents(" ");
            spaces[spacePosition-1].ChangeContents(" ");
            spaces[spacePosition+1].ChangeContents(" ");
            // Change the space below, the space below-left, and the space below-right.
            spaces[spacePosition+columns].ChangeContents(" ");
            spaces[spacePosition+columns-1].ChangeContents(" ");
            spaces[spacePosition+columns+1].ChangeContents(" ");
        }
        // Check whether the space that was clicked is on the right column.
        else if(spacePosition%columns == columns-1) {
            // Change the space and the space to the left.
            spaces[spacePosition].ChangeContents(" ");
            spaces[spacePosition-1].ChangeContents(" ");
            // Change the space above and the one above-left.
            spaces[spacePosition-columns].ChangeContents(" ");
            spaces[spacePosition-columns-1].ChangeContents(" ");
            // Change the space below and the one below-left.
            spaces[spacePosition+columns].ChangeContents(" ");
            spaces[spacePosition+columns-1].ChangeContents(" ");
        }
        // Check whether the space that was clicked is on the bottom row.
        else if(Math.floor(spacePosition/columns) == rows-1) {
            // Change the space, the space to the left, and the space to the right.
            spaces[spacePosition].ChangeContents(" ");
            spaces[spacePosition-1].ChangeContents(" ");
            spaces[spacePosition+1].ChangeContents(" ");
            // Change the space above, the space above-left, and the space above-right.
            spaces[spacePosition-columns].ChangeContents(" ");
            spaces[spacePosition-columns-1].ChangeContents(" ");
            spaces[spacePosition-columns+1].ChangeContents(" ");
        }
        // Check whether the space that was clicked is on the left column.
        else if(spacePosition%columns == 0) {
            // Change the space and the space to the right.
            spaces[spacePosition].ChangeContents(" ");
            spaces[spacePosition+1].ChangeContents(" ");
            // Change the space above and the one above-right.
            spaces[spacePosition-columns].ChangeContents(" ");
            spaces[spacePosition-columns+1].ChangeContents(" ");
            // Change the space below and the one below-right.
            spaces[spacePosition+columns].ChangeContents(" ");
            spaces[spacePosition+columns+1].ChangeContents(" ");
        }
        else {
            // Change the space, the space to the left, and the space to the right.
            spaces[spacePosition].ChangeContents(" ");
            spaces[spacePosition-1].ChangeContents(" ");
            spaces[spacePosition+1].ChangeContents(" ");
            // Change the space above, the space above-left, and the space above-right.
            spaces[spacePosition-columns].ChangeContents(" ");
            spaces[spacePosition-columns-1].ChangeContents(" ");
            spaces[spacePosition-columns+1].ChangeContents(" ");
            // Change the space below, the space below-left, and the space below-right.
            spaces[spacePosition+columns].ChangeContents(" ");
            spaces[spacePosition+columns-1].ChangeContents(" ");
            spaces[spacePosition+columns+1].ChangeContents(" ");
        }
        firstMove = false;
    }
    
    // Whether or not it's the first turn, reveal the current space.
    spaces[spacePosition].Reveal();

    // Reveal any adjacent spaces. It's important to, similar to above, make sure to find out where the adjacent spaces are. You don't want to check the space to the left if you're in the upper-left corner.
    // First check if the space is blank, if it isn't then the surroundings shouldn't be revealed.
    if(spaces[spacePosition].Contents == " ")
        // If upper-left corner.
        if(spacePosition == 0) {
            // Reveal space to the right.
            SpaceClick(spaces, spacePosition+1, columns, rows);
            // Change the space below and the one below-right.
            SpaceClick(spaces, spacePosition+columns, columns, rows);
            SpaceClick(spaces, spacePosition+columns+1, columns, rows);
        }
        // If upper-right corner.
        else if(spacePosition == columns-1) {
            // Reveal the space to the left.
            SpaceClick(spaces, spacePosition-1, columns, rows);
            // Reveal the space below-left.
            SpaceClick(spaces, spacePosition+columns, columns, rows);
            SpaceClick(spaces, spacePosition+columns-1, columns, rows);
        }
        // If lower-left corner.
        else if(spacePosition == rows*columns - columns) {
            // Reveal the space to the right.
            SpaceClick(spaces, spacePosition+1, columns, rows);
            // Reveal the space below and the one below-right
            SpaceClick(spaces, spacePosition-columns, columns, rows);
            SpaceClick(spaces, spacePosition-columns+1, columns, rows);
        }
        // If lower-right corner.
        else if(spacePosition == rows*columns-1) {
            // Reveal the space to the left.
            SpaceClick(spaces, spacePosition-1, columns, rows);
            // Reveal the space above-left and the one above.
            SpaceClick(spaces, spacePosition-columns-1, columns, rows);
            SpaceClick(spaces, spacePosition-columns, columns, rows);
        }
        // If top row.
        else if(Math.floor(spacePosition/columns) == 0) {
            // Reveal the space to the left and the one to the right.
            SpaceClick(spaces, spacePosition-1, columns, rows);
            SpaceClick(spaces, spacePosition+1, columns, rows);
            // Change the space below-left, the space below, and the space below-right.
            SpaceClick(spaces, spacePosition+columns-1, columns, rows);
            SpaceClick(spaces, spacePosition+columns, columns, rows);
            SpaceClick(spaces, spacePosition+columns+1, columns, rows);
        }
        // If right column.
        else if(spacePosition%columns == columns-1) {
            // Reveal the space to the left.
            SpaceClick(spaces, spacePosition-1, columns, rows);
            // Reveal the space above-left and the one above.
            SpaceClick(spaces, spacePosition-columns-1, columns, rows);
            SpaceClick(spaces, spacePosition-columns, columns, rows);
            // Change the space below-left, and the one below.
            SpaceClick(spaces, spacePosition+columns-1, columns, rows);
            SpaceClick(spaces, spacePosition+columns, columns, rows);
        }
        // If bottom row.
        else if(Math.floor(spacePosition/columns) == rows-1) {
            // Reveal the space to the left and the one to the right.
            SpaceClick(spaces, spacePosition-1, columns, rows);
            SpaceClick(spaces, spacePosition+1, columns, rows);
            // Change the space above-left, the space above, and the space above-right.
            SpaceClick(spaces, spacePosition-columns-1, columns, rows);
            SpaceClick(spaces, spacePosition-columns, columns, rows);
            SpaceClick(spaces, spacePosition-columns+1, columns, rows);
        }
        // If left column.
        else if(spacePosition%columns == 0) {
            // Reveal the space to the right.
            SpaceClick(spaces, spacePosition-1, columns, rows);
            // Reveal the space above and the one above-right.
            SpaceClick(spaces, spacePosition-columns, columns, rows);
            SpaceClick(spaces, spacePosition-columns+1, columns, rows);
            // Reveal the space below and the one below-right.
            SpaceClick(spaces, spacePosition+columns, columns, rows);
            SpaceClick(spaces, spacePosition+columns+1, columns, rows);
        }
        else {
            // Recursively call the function again for the spaces to the left, right.
            SpaceClick(spaces, spacePosition-1, columns, rows);
            SpaceClick(spaces, spacePosition+1, columns, rows);
            // Do the same for the above, above-left, and above-right spaces.
            SpaceClick(spaces, spacePosition-columns, columns, rows);
            SpaceClick(spaces, spacePosition-columns-1, columns, rows);
            SpaceClick(spaces, spacePosition-columns+1, columns, rows);
            // And do the same for the below, below-left, and below-right spaces.
            SpaceClick(spaces, spacePosition+columns, columns, rows);
            SpaceClick(spaces, spacePosition+columns-1, columns, rows);
            SpaceClick(spaces, spacePosition+columns+1, columns, rows);
        }
}

function ShowAll(spacesToShow) {
    for(let currentSpaceNumber = 0; currentSpaceNumber < spacesToShow.length; currentSpaceNumber++) {
        spacesToShow[currentSpaceNumber].Reveal();
    }
}

// Use the Fisher-Yates shuffle algorithm, minorly modified from the implementation available at https://github.com/Daplie/knuth-shuffle . Licensed under the Apache License 2.0 available at http://www.apache.org/licenses/ .
function Shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const container = document.getElementById("gameContainer");
let spaces = InitialiseGrid(16, 16);
AddToGrid(spaces, 16, 16);
document.getElementById("secretShowAll").addEventListener("click", () => {ShowAll(spaces)});

// A global variable is used here to keep track of whether the current move is the first one to have been made.
var firstMove = true;