#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const interactor = require('./lib/interactor');
const commandController = require('./lib/commandController')

clear();

console.log(
    chalk.yellow(
        figlet.textSync('Welcome To Test', {
            horizontalLayout: 'full'
        })
    )
);


const giveHints = async (input) => {
    // console.log(chalk.red('Input in givehints is' + input));

    let word = null;
    if(input === null || input === undefined)
    {
        let generatedWord = await commandController.generateRandomWord();
        word  = generatedWord.data.word;
    }else{
        word = input;
    }

    console.log(chalk.red.bold('WORD is ' + word));

    // * SHOW THE HINTS
    await commandController.definition(word);
    await commandController.synonym(word, 1);
    await commandController.antonym(word);

    return word;
}


// create another variable for game 
const runGame = async () => {
    // * WORK IN PROGRESS
    await interactor.playGame();

    console.log(
        chalk.white.bold(
            figlet.textSync('Welcome To Game', {
                horizontalLayout: 'full'
            })
        )
    );

    let word = await giveHints();
    checkAnswer(word);
}


const checkAnswer = async (word) => {
    let getAnswerFromUser = await interactor.getAnswer();
    let inputFromUser = getAnswerFromUser.answer;
    let checkAnswerData = await commandController.checkAnswer(inputFromUser, word);

    if (checkAnswerData === true) {
        console.log(chalk.green('Correct Answer'));
        runGame();
    } else {
        const giveOptions = await interactor.giveOptions();
        // console.log(giveOptions.choices);
        if(giveOptions.choices === 'Try again'){
            checkAnswer(word)
        }else if(giveOptions.choices === 'Hint'){
            giveHints(word);
            checkAnswer(word);
        }else{
            console.log(chalk.greenBright.italic('Correct answer is '+ word+' . Thanks for playing.'))
            run();
        }
    }
}


const run = async () => {
    const getInput = await interactor.start();
    const userInput = getInput.command;
    const getWord = userInput.split(' ');

    let data = {};
    if (userInput.indexOf('defn') === 0) {
        datya = commandController.definition(getWord[1]);
    } else if (userInput.indexOf('syn') === 0) {
        data = commandController.synonym(getWord[1], 1);
    } else if (userInput.indexOf('ant') === 0) {
        data = commandController.antonym(getWord[1]);
    } else if (userInput.indexOf('ex') === 0) {
        data = commandController.example(getWord[1]);
    } else if (getWord[0] !== null && getWord[0] !== undefined && getWord[0] !== "" && getWord[0] !== "play") {
        data = commandController.fullDictionary(getWord[0]);
    } else if (userInput === "") {
        data = commandController.fullDictionaryRandom(getWord[1]);
    } else if (userInput === 'play') {
        runGame();
    } else {
        console.log(chalk.bold.red('No COMMAND FOUND !!!!'))
    }

    // run();
    // process.exit();
};

run();