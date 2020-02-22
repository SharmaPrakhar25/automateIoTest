const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const interactor = require('./lib/interactor');
const commandController = require('./lib/commandController')

clear();

console.log(
    chalk.yellow(
        figlet.textSync('Welcome', {
            horizontalLayout: 'full'
        })
    )
);


const run = async () => {
    const getInput = await interactor.start();

    const userInput = getInput.command;

    const getWord = userInput.split(' ');

    if (userInput.indexOf('defn') === 0) {

        commandController.definition(getWord[1]);
    } else if (userInput.indexOf('syn') === 0) {

        commandController.synonym(getWord[1]);
    } else if (userInput.indexOf('ant') === 0) {

        commandController.antonym(getWord[1]);
    } else if (userInput.indexOf('ex') === 0) {

        commandController.example(getWord[1]);
    } else if (getWord[0] !== null && getWord[0] !== undefined && getWord[0] !== "" && getWord[0] !== "play") {

       commandController.fullDictionary(getWord[0]);
    } else if (userInput === "") {

        commandController.fullDictionaryRandom(getWord[1]);
    } else if (userInput === 'play') {
        // * WORK IN PROGRESS
        const startTheGame = await interactor.playgame();
    } else {
        console.log(chalk.bold.red('No COMMAND FOUND !!!!'))
    }

    run();
};

run();