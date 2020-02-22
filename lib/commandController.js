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
            console.log(chalk.blue.bold('Definitions found'));
            for (value in getDefinition.data) {
                console.log(chalk.green(getDefinition.data[value].text));
            }
        } else {
            console.log(chalk.red(getDefinition.data + ', Please try again with some different words.'));
            // setTimeout(() => {
            //     clear();
            // }, 3000);
        }

    },

    synonym: async (word) => {
        // console.log('Inside command controller -- got input '+word);
        const getSynonym = await axios.get(process.env.API_BASE_URL + '/word/' + word + '/relatedWords?api_key=' + process.env.API_KEY)
            .then(function (response) {
                return {
                    data: response.data,
                    status: response.status
                }
            })
            .catch(function (error) {
                // handle error
                // console.log(error.response)
                // return false;
                return {
                    status: error.response.status,
                    data: error.response.data.error
                }
            })

        if (getSynonym.status == process.env.RESPONSE_STATUS_SUCCESS && getSynonym.data[0].relationshipType === 'synonym') {
            console.log(chalk.blue.bold('Synonyms found'));
            for (value in getSynonym.data) {
                console.log(chalk.green(getSynonym.data[value].words));
            }
        } else {
            console.log(chalk.red('No Synonym found, Please try again with some different words.'));
            // setTimeout(() => {
            //     clear();
            // }, 3000);
        }
    },

    antonym: async (word) => {
        // console.log('Inside command controller -- got input '+word);
        const getAntonym = await axios.get(process.env.API_BASE_URL + '/word/' + word + '/relatedWords?api_key=' + process.env.API_KEY)
            .then(function (response) {
                // handle success
                // console.log(response.data);
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
            console.log(chalk.blue.bold('Antonyms found'));
            for (value in getAntonym.data) {
                console.log(chalk.green(getAntonym.data[value].words));
            }
        } else {
            console.log(chalk.red('No Antonym found, Please try again with some different words.'));
            // setTimeout(() => {
            //     clear();
            // }, 3000);
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
            console.log(chalk.blue.bold('Examples found'));
            for (value in getExamples.data.examples) {
                // data = JSON.stringify();
                console.log(chalk.green(getExamples.data.examples[value].text));
                console.log('-----------------------------------------');
            }
        } else {
            console.log(chalk.red('No Example found, Please try again with some different words.'));
            // setTimeout(() => {
            //     clear();
            // }, 3000);
        }
    },


    fullDictionary: (word) => {
        // console.log('Inside full dict command controller -- got input '+word);
        // need to use Word Definitions, Word Synonyms, Word Antonyms & Word Examples
        module.exports.definition(word);

        module.exports.synonym(word);

        module.exports.antonym(word);

        module.exports.example(word);

    },

    fullDictionaryRandom: async () => {
        // console.log('Inside command controller -- got input '+word);
        // Generate a random word and then do everything from full dictonary, we can call full dictonary 

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

        if (getRandomWord.status == process.env.RESPONSE_STATUS_SUCCESS) {
            console.log(chalk.yellow.bold.italic("Your randomly generated word is "+getRandomWord.data.word))

            module.exports.definition(getRandomWord.data.word);

            module.exports.synonym(getRandomWord.data.word);

            module.exports.antonym(getRandomWord.data.word);

            module.exports.example(getRandomWord.data.word);
        }else{
            console.log(chalk.red('Something went wrong, Please try again'));
        }
    },

    play: (word) => {
        // * WORK IN PROGRESS
    }
}