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
                return {
                    status: error.response.status,
                    data: error.response.data.error
                }
            });

        if (getDefinition.status == process.env.RESPONSE_STATUS_SUCCESS) {
            console.log(chalk.blue.bold('Definition -'));
            console.log(chalk.green(getDefinition.data[Math.floor(Math.random() * getDefinition.data.length)].text));

            return {
                data: null,
                status: process.env.RESPONSE_STATUS_SUCCESS
            };
        } else {
            if (getDefinition.data !== undefined) {
                console.log(chalk.red(getDefinition.data+ ', Please try again with some different words.'));
            } else {
                console.log(chalk.red('BAD INPUT'));
            }

            return {
                data: null,
                status: process.env.RESPONSE_STATUS_FAIL
            };
        }

    },

    synonym: async (word, returnCount) => {

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
                return {
                    data: null,
                    status: process.env.RESPONSE_STATUS_SUCCESS
                };
            } else {
                return {
                    data: getSynonym.data[0].words,
                    status: process.env.RESPONSE_STATUS_SUCCESS
                };
            }
        } else {
            if (returnCount) {
                console.log(chalk.red('No Synonym found , Please try again with some different words.'));
            }

            return {
                data: null,
                status: process.env.RESPONSE_STATUS_FAIL
            };

        }
    },

    antonym: async (word, returnCount) => {

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
            if (returnCount) {
                console.log(chalk.blue.bold('Antonym -'));
                console.log(chalk.green(getAntonym.data[0].words[Math.floor(Math.random() * getAntonym.data[0].words.length)]));
                return {
                    data: getAntonym.data[0].words,
                    status: process.env.RESPONSE_STATUS_SUCCESS
                };
            } else {
                return {
                    data: getAntonym.data[0].words,
                    status: process.env.RESPONSE_STATUS_SUCCESS
                };
            }
        } else {
            if (returnCount) {
                console.log(chalk.red('No Antonym found , Please try again with some different words.'));
            }

            return {
                data: null,
                status: process.env.RESPONSE_STATUS_FAIL
            };
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

        if (getExamples.status == process.env.RESPONSE_STATUS_SUCCESS) {
            console.log(chalk.blue.bold('Examples  '));
            console.log(chalk.green(getExamples.data.examples[Math.floor(Math.random() * getExamples.data.examples.length)].text));
            return {
                data: null,
                status: process.env.RESPONSE_STATUS_SUCCESS
            };
        } else {
            return {
                data: null,
                status: process.env.RESPONSE_STATUS_FAIL
            };
        }
    },


    fullDictionary: async (word) => {

        const definition = await module.exports.definition(word);

        if (definition.status == process.env.RESPONSE_STATUS_SUCCESS) {
            await module.exports.synonym(word, 0);
            await module.exports.antonym(word, 0);
            await module.exports.example(word);

            return {
                data: null,
                status: process.env.RESPONSE_STATUS_SUCCESS
            };
        } else {
            return {
                data: null,
                status: process.env.RESPONSE_STATUS_FAIL
            };
        }


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
            //          check this throwing error some times
            if (getSynonym.status == process.env.RESPONSE_STATUS_SUCCESS) {
                for (value in getSynonym.data) {
                    if (getSynonym.data[value] === inputAnswer) {
                        return true;
                    }
                }
            } else {
                return false;
            }
        }
    }
}