const inquirer = require('inquirer');

module.exports = {
    start: () => {
        const questions = [{
            name: 'command',
            type: 'input',
            message: 'Put your command',
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

    playgame: () => {
        const questions = [{
            name: 'command',
            type: 'input',
            message: 'Can you guess the word ? ',
            validate: function (value) {
                //   if (value.length) {
                //     return true;
                //   } else {
                //     return 'Please enter a valid command';
                //   }
                return true;
            }
        },
        ];
        return inquirer.prompt(questions);
    }
};