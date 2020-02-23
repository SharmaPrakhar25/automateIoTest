const inquirer = require('inquirer');

module.exports = {
    start: () => {
        const questions = [{
            name: 'command',
            type: 'input',
            message: 'Waiting for input',
            validate: function (value) {
                //   if (value.length) {
                //     return true;
                //   } else {
                //     return 'Please enter a valid command';
                //   }
                return true;
            }
        }];
        return inquirer.prompt(questions);
    },

    playGame: () => {
        const questions = [{
            name: 'allowgame',
            type: 'confirm',
            message: 'Start the game ?',
        },
        ];
        return inquirer.prompt(questions);
    },

    getAnswer: () => {
        const getanswer = [{
            name: 'answer',
            type: 'input',
            message: 'your Answer ?',
            validate: function (value) {
                  if (value.length) {
                    return true;
                  } else {
                    return 'Please enter a valid answer';
                  }
            }
        }];

        return inquirer.prompt(getanswer);
    },

    giveOptions: () => {
        const choices = [{
            name: 'choices',
            type: 'rawlist',
            message: 'Wrong answer, Pick one from the list',
            choices: [
                'Try again',
                'Hint',
                'Quit'
            ]
        }];
        return inquirer.prompt(choices);
    }
};