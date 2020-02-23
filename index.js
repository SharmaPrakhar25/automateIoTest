#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const interactor = require('./lib/interactor');
const commandController = require('./lib/commandController');
const commander = require('commander');
require('events').EventEmitter.prototype._maxListeners = 100;



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
    if (input === null || input === undefined) {
        let generatedWord = await commandController.generateRandomWord();
        word = generatedWord.data.word;
    } else {
        word = input;
    }

    // console.log(chalk.red.bold('WORD is ' + word));

    // * SHOW THE HINTS
    await commandController.definition(word);
    await commandController.synonym(word, 0);
    await commandController.antonym(word, 0);

    return word;
}


// create another variable for game 
const runGame = async () => {
    // * WORK IN PROGRESS
    let permission = await interactor.playGame();

    if (permission.allowgame === true) {
        console.log(
            chalk.white.bold(
                figlet.textSync('Guess the word !!!!', {
                    horizontalLayout: 'full'
                })
            )
        );

        let word = await giveHints();
        checkAnswer(word);
    }else{
        run();
    }
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
        if (giveOptions.choices === 'Try again') {
            checkAnswer(word);
        } else if (giveOptions.choices === 'Hint') {
            giveHints(word);
            checkAnswer(word);
        } else {
            console.log(chalk.greenBright.italic('Correct answer is ' + word + ' . Thanks for playing.'));
            await commandController.fullDictionary(word);
            run();
        }
    }
}


const run = async () => {

    try {
        const getInput = await interactor.start();
        const userInput = getInput.command;
        const getWord = userInput.trim().split(' ');

        for (value in getWord) {
            getWord[value] = getWord[value].toLowerCase();
        }

        // console.log(getWord);
        let data = {};

        // commander
        //     .command('defn <word>')
        //     .description('Gives the definition of the word')
        //     .action(async (word) => {
        //         await commandController.definition(word)
        //     });


        // commander
        //     .command('syn <word>')
        //     .description('Gives the synonym of the word')
        //     .action(async (word) => {
        //         await commandController.synonym(word, 1)
        //     });


        // commander
        //     .command('ant <word>')
        //     .description('Gives the antonym of word')
        //     .action(async (word) => {
        //         await commandController.antonym(word)
        //     });


        // commander
        //     .command('<word>')
        //     .description('Gives full dictionary for the word')
        //     .action(async (word) => {
        //         await commandController.fullDictionary(word)
        //     });

        // commander
        //     .command('')
        //     .description('Gives full dictionary for the word of the day')
        //     .action(async () => {
        //         await commandController.fullDictionaryRandom()
        //     });

        // commander
        //     .command('play')
        //     .description('Starts the game')
        //     .action(runGame());



        // commander.parse(process.argv);



        if (userInput.indexOf('defn') === 0) {
            data = await commandController.definition(getWord[1]);
        } else if (userInput.indexOf('syn') === 0) {
            data = await commandController.synonym(getWord[1], 1);
        } else if (userInput.indexOf('ant') === 0) {
            data = await commandController.antonym(getWord[1], 1);
        } else if (userInput.indexOf('ex') === 0) {
            data = await commandController.example(getWord[1]);
        } else if (getWord[0] !== null && getWord[0] !== undefined && getWord[0] !== "" && getWord[0] !== "play") {
            data = await commandController.fullDictionary(getWord[0]);
        } else if (userInput === "") {
            data = await commandController.fullDictionaryRandom(getWord[1]);
        } else if (userInput === 'play') {
            runGame();
        } else {
            console.log(chalk.bold.red('No COMMAND FOUND !!!!'))
        }

        // console.log("index -- " + data);
        if (data !== undefined && data !== null) {
            if (Object.keys(data).length > 0) {
                run();
            }

        }
    } catch (err) {
        console.log(err);
    }
};

run();