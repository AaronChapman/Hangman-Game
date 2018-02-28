/* declaring & initializing arrays for the word bank, correct & incorrect guesses,
    letters guessed, and the characters in the currently selected word */
var word_bank = ["coding", "bootcamp", "georgia", "tech", "atlanta", "javascript", "html", "css", "software", "development"], correct_guesses = [], incorrect_guesses = [], letters_guessed = [], current_word_characters = [];

/* hexidecimal characters */
var hex_characters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

/* variables to store the current_word, its length, the number of guesses
    the player has left, and a game_over determiner*/
var current_word = "";
var current_word_length = 0, guesses_left = 0;
var game_over = false, animation_running = false;

/* new_game() method */
function new_game() {
    /* reset global variables */
    correct_guesses = [], incorrect_guesses = [], letters_guessed = [];
    guesses_left = 12;
    game_over = false;
    animation_running = false;

    /* reset text in paragraph tags */
    $(".status").text("start guessing by hitting any key");
    $(".word_mask").text("");
    $(".guesses_left").text("guesses left: 0");
    $(".correct_letters_guessed").text("correct guesses: ");
    $(".incorrect_letters_guessed").text("incorrect guesses: ");

    /* choose a new word & start background color animation loop */
    new_word();

    random_warm_hex();
}

/* new_word() method */
function new_word() {
    /* select random index from word bank, store its length,
        and determine number of guesses available to the player */
    current_word = word_bank[Math.floor(Math.random() * word_bank.length)];
    current_word_length = current_word.length;
    guesses_left = current_word_length + 2;

    $(".guesses_left").text("guesses left: " + guesses_left);

    /* split characters from word into current_word_characters array elements */
    current_word_characters = current_word.split("");

    /* set the number of underscores, based on current_word's length */
    for (var i = 0; i < current_word.length; i++) {
        $(".word_mask").append("_ ");

        /* reinitializing the letters_guessed array */
        letters_guessed.push("_ ");
    }
}

/* self-explanatory */
function decrement() {
    guesses_left--;

    $(".guesses_left").text("guesses left: " + guesses_left);
}

/* creates a random hexidecimal value within certain parameters */
function random_warm_hex() {
    /* hex string base */
    var temp_hex = "#";

    /* chooses an appropriate value for all six characters of the hexidecimal */
    for (i = 0; i < 6; i++) {
        var random_index = Math.floor(Math.random() * hex_characters.length);

        if (i < 2)
            while (random_index < 3 || random_index > 8)
                random_index = Math.floor(Math.random() * hex_characters.length);
        else if (i == 2 || i == 3)
            while (random_index > 2)
                random_index = Math.floor(Math.random() * hex_characters.length);
        else
            while (random_index > 5)
                random_index = Math.floor(Math.random() * hex_characters.length);

        temp_hex = temp_hex.concat(hex_characters[random_index]);
    }

    /* set's body's background color to the newly formed hexidecimal string*/
    $('body').css('background-color', temp_hex);

    setTimeout(function() {
        random_warm_hex();
    }, 1000);
}

/* runs every time a keyup event happens on the document */
document.onkeyup = function(event) {
    if (!animation_running) {
        /* grab whichever key was pressed */
        var letter = event.key.toLowerCase();

        /* check to see if a new game needs to start */
        if (guesses_left == 0 || game_over)
            new_game();
        /* if the game is in progress */
        else {
            /* regex for alphabet comparison */
            var letters = /^[A-Za-z]+$/;

            /* if key pressed is a letter of the alphabet */
            if(letters.test(letter) && letter.length == 1) {
                console.log(letters.test(letter));

                /* update status message */
                $(".status").text("choose another letter");

                /* if the current_word contains the letter that was pressed */
                if (current_word.indexOf(letter) !== -1) {
                    /* and if the letter has not already been guessed by the player */
                    if (!correct_guesses.includes(letter)) {
                        /* scan through the word */
                        for (var i = 0; i < current_word.length; i++) {
                            /* place guessed letter in its corresponding position
                                in letters_guessed array, and push the guessed letter
                                onto the correct_guesses array */
                            if (current_word_characters[i] == letter) {
                                letters_guessed[i] = letter;

                                /* check for duplicate letters & update display */
                                if (!correct_guesses.includes(letter)) {
                                    correct_guesses.push(letter);

                                    $(".correct_letters_guessed").append(letter + " ");
                                }
                            }
                        }

                        /* update the word_mask element's value by joining the elements
                            in the letters_guessed array into a single string */
                        $(".word_mask").text("");
                        $(".word_mask").text(letters_guessed.join(" "));
                        /* if the user already guessed that letter */
                    } else
                        $(".status").text("you've already guessed that letter");
                /* if the current_word does not contain the letter that was pressed */
                } else {
                    /* if the user has not already guessed the letter */
                    if (!incorrect_guesses.includes(letter)) {
                        /* push the letter to the incorrect_guesses array,
                            decrement guesses_left and update the display */
                        incorrect_guesses.push(letter);
                        
                        $(".incorrect_letters_guessed").append(letter + " ");
                        
                        /* decrement guesses_left */
                        decrement();
                    /* if the user already guessed that letter */
                    } else
                        $(".status").text("you've already guessed that letter");
                }
            }
        }

        /* check on every key up event if the joined letters in letters_guessed
            match the current_word, and sets the game_over determiner if so */
        if (letters_guessed.join("") == current_word) {
            game_over = true;
            animation_running = true;

            /* update display and do a little animation */
            $(".status").text("you won!");
            $(".game_container").addClass("shake-slow");
            $(".game_container").addClass("shake-constant");
            $(".word_mask").text("the word was: " + current_word);

            /* timed call to reverse animation and set display text again */
            setTimeout(function() {
                $(".game_container").removeClass("shake-slow");
                $(".game_container").removeClass("shake-constant");
                $(".status").text("press any key to try again");
                
                animation_running = false;
            }, 2000);
        }

        /* if the player loses */
        if (guesses_left == 0 && !(letters_guessed.join("") == current_word)) {
            game_over = true;
            animation_running = true;

            /* update display and do a little animation */
            $(".status").text("You Lost!");
            $(".game_container").addClass("shake-opacity");
            $(".game_container").addClass("shake-constant");
            $(".word_mask").text("the word was: " + current_word);

            /* timed call to reverse animation and set display text again */
            setTimeout(function() {
                $(".game_container").removeClass("shake-opacity");
                $(".game_container").removeClass("shake-constant");
                $(".status").text("press any key to try again");

                animation_running = false;
            }, 2000);
        }
    }
}