const axios = require('axios').default;
const chalk = require('chalk');
const clear = require('clear');
require('dotenv').config()

module.exports = {
    definition: async (word) => {
        // console.log('Inside command controller -- got input '+word);
        const getDefinition = await axios.get(process.env.API_BASE_URL + '/word/' + word + '/definitions?api_key=' + process.env.API_KEY)
            .then(function (response) {
                return {
                    status: response.status,
                    data: response.data
                }
            })
            .catch(function (error) {
                // handle error
                // console.log(error.response.data.error);
                return {
                    status: error.response.status,
                    data: error.response.data.error
                }
            });

        if (getDefinition.status == process.env.RESPONSE_STATUS_SUCCESS) {
            console.log(chalk.blue.bold('Definitions -'));
            console.log(chalk.green(getDefinition.data[Math.floor(Math.random() * getDefinition.data.length)].text));
        } else {
            console.log(chalk.red(getDefinition.data + ', Please try again with some different words.'));
        }

    },

    synonym: async (word, returnCount) => {
        // console.log('Inside command controller -- got input '+word);
        const getSynonym = await axios.get(process.env.API_BASE_URL + '/word/' + word + '/relatedWords?api_key=' + process.env.API_KEY)
            .then(function (response) {
                return {
                    data: response.data,
                    status: response.status
                }
            })
            .catch(function (error) {
                return {
                    status: error.response.status,
                    data: error.response.data.error
                }
            })

        if (getSynonym.status == process.env.RESPONSE_STATUS_SUCCESS && getSynonym.data[0].relationshipType === 'synonym') {
            if (returnCount) {
                console.log(chalk.blue.bold('Synonym -'));
                console.log(chalk.green(getSynonym.data[0].words[Math.floor(Math.random() * getSynonym.data[0].words.length)]));
            } else {
                return {
                    data: getSynonym.data[0].words,
                    status: process.env.RESPONSE_STATUS_SUCCESS
                };
            }
        } else {
            console.log(chalk.red('No Synonym found, Please try again with some different words.'));
            return {
                data: null,
                status: process.env.RESPONSE_STATUS_FAIL
            };
        }
    },

    antonym: async (word) => {
        // console.log('Inside command controller -- got input '+word);
        const getAntonym = await axios.get(process.env.API_BASE_URL + '/word/' + word + '/relatedWords?api_key=' + process.env.API_KEY)
            .then(function (response) {
                return {
                    data: response.data,
                    status: response.status
                }
            })
            .catch(function (error) {
                // handle error
                return {
                    status: error.response.status,
                    data: error.response.data.error
                }
            });

        if (getAntonym.status == process.env.RESPONSE_STATUS_SUCCESS && getAntonym.data[0].relationshipType === 'antonym') {
            console.log(chalk.blue.bold('Antonym -'));
            console.log(chalk.green(getAntonym.data[0].words[Math.floor(Math.random() * getAntonym.data[0].words.length)]));
        } else {
            console.log(chalk.red('No Antonym found , Please try again with some different words.'));
        }
    },

    example: async (word) => {
        // console.log('Inside command controller -- got input '+word);
        const getExamples = await axios.get(process.env.API_BASE_URL + '/word/' + word + '/examples?api_key=' + process.env.API_KEY)
            .then(function (response) {
                return {
                    data: response.data,
                    status: response.status
                }
            })
            .catch(function (error) {
                // handle error
                return {
                    status: error.response.status,
                    data: error.response.data.error
                }
            });

        // console.log(getExamples.data.examples);
        // return false;
        if (getExamples.status == process.env.RESPONSE_STATUS_SUCCESS) {
            console.log(chalk.blue.bold('Examples  '));
            console.log(chalk.green(getExamples.data.examples[Math.floor(Math.random() * getExamples.data.examples.length)].text));
        } else {
            console.log(chalk.red('No Example found , Please try again with some different words.'));
        }
    },


    fullDictionary: async (word) => {
        // console.log('Inside full dict command controller -- got input '+word);
        // need to use Word Definitions, Word Synonyms, Word Antonyms & Word Examples
        module.exports.definition(word);
        module.exports.synonym(word, 1);
        module.exports.antonym(word);
        module.exports.example(word);

    },

    generateRandomWord: async () => {

        const getRandomWord = await axios.get(process.env.API_BASE_URL + '/words/randomWord?api_key=' + process.env.API_KEY)
            .then(function (response) {
                return {
                    data: response.data,
                    status: response.status
                }
            })
            .catch(function (error) {
                // handle error
                return {
                    status: error.response.status,
                    data: error.response.data.error
                }
            });


        return getRandomWord;

    },

    fullDictionaryRandom: async () => {
        // console.log('Inside command controller -- got input '+word);
        // Generate a random word and then do everything from full dictonary, we can call full dictonary 
        const randomWord = await module.exports.generateRandomWord();
        if (randomWord.status == process.env.RESPONSE_STATUS_SUCCESS) {
            console.log(chalk.yellow.bold.italic("Your randomly generated word is " + randomWord.data.word))
            module.exports.fullDictionary(randomWord.data.word)
        } else {
            console.log(chalk.red('Something went wrong, Please try again'));
        }
    },

    checkAnswer: async (inputAnswer, word) => {
        // * WORK IN PROGRESS
        if (inputAnswer === word) {
            return true;
        } else {
            const getSynonym = await module.exports.synonym(word, 0);
// check this trowing error some times
            if (getSynonym.status == process.env.RESPONSE_STATUS_SUCCESS){
                for (value in getSynonym.data) {
                    if (getSynonym.data[value] === inputAnswer) {
                        return true;
                    }
                }
            }else{
                return false;
            }
        }
    }
}