"use strict";

var items = [  "aargh", "aarrgh", "aarrghh", "aarti", "aartis", "aas", "abac", "abaca", "abacas", "abaci", "aback", "abacs",  "abactor", "orchillas", "orchils", "orchis", "orchises", "orchitic", "orchitis", "orchitises", "orcin", "orcine", "orcines", "orcinol",  "zymotic",  "zymotics", "zymurgies", "zymurgy", "zythum", "inaugural", "inaugurate", "inaugurated", "inaugurates",  "inaugurator", "inaugurators",  "inaurate",  "effete", "effetely", "effeteness",  "efficacies", "efficacity", "efficacy", "efficience", "brinny", "brins", "briny", "brio", "brioche", "brioches", "briolette", "briolettes", "brionies", "briony", "brios", "briquet", "briquets", "briquette", "briquetted",  "bris", "brisance", "brisances", "brisant", "brise", "brises", "brisk", "brisked", "brisken", "briskened", "briskening", "briskens", "brisker", "briskest", "brisket", "briskets", "briskier", "briskiest", "brisking", "briskish", "briskly", "briskness", "brisknesses"];
var Results = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.totalWords = obj.totalWords;
        this.successfulWords = obj.successfulWords;
        this.forgottenWords = obj.forgottenWords;
        this.totalWatchingTime = obj.totalWatchingTime;
        this.totalStartTypeTime = obj.totalStartTypeTime;
        this.totalTypingTime = obj.totalTypingTime;
    } else {
        this.totalWords = 0;
        this.successfulWords = 0;
        this.forgottenWords = 0;
        this.totalWatchingTime = 0;
        this.totalStartTypeTime = 0;
        this.totalTypingTime = 0;
    }
};

Results.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var WordGame = function () {
    LocalContractStorage.defineMapProperty(this, "userResults", {
        parse: function (text) {
            return new Results(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

WordGame.prototype = {
    init: function () {

    },
    getWords: function (count) {
        try {

            var s = parseInt(count)
        }
        catch (e) {
            throw Error("successfull_words is not an integer")
        }
        if (s > 10 || s <= 0) {
            throw Error("successfull_words is not between 1 and 10")
        }
        var words = [];
        var indexes = [];
        for (var i = 0; i < s; i++) {
            var index = Math.floor(Math.random() * items.length / s + (items.length / s) * i);
            indexes.push(index);
            words.push(items[index]);
        }
        return {'words': words, 'wordsLength': words.length}
    },
    addResults: function (successful_words, total_words, forgotten_words, total_watching_time, total_start_type_time, total_typing_time) {
        try {
            var successfulWords = parseInt(successful_words);
            var totalWords = parseInt(total_words);
            var forgottenWords = parseInt(forgotten_words);
            var totalWatchingTime = parseInt(total_watching_time);
            var totalStartTypeTime = parseInt(total_start_type_time);
            var totalTypingTime = parseInt(total_typing_time);

        }
        catch (e) {
            throw Error("all params should be integers")
        }
        if (isNaN(successfulWords) || isNaN(totalWords) ||
            isNaN(forgottenWords) || isNaN(totalWatchingTime) ||
            isNaN(totalStartTypeTime) || isNaN(totalTypingTime)) {
            throw  Error("all params should be integers")
        }
        if (totalWords > 10 || totalWords <= 0) {
            throw Error("total_words is not between 1 and 10")
        }
        if (successfulWords > totalWords || successfulWords < 0) {
            throw Error("successful_words is not between 0 and " + totalWords)
        }
        if (forgottenWords > totalWords || successfulWords < 0) {
            throw Error("forgotten_words is not between 0 and " + totalWords)
        }
        if (forgottenWords + successfulWords > totalWords) {
            throw  Error("forgotten_words + successful_words is bigger that total_words")
        }
        if (totalWatchingTime < 0 || totalStartTypeTime < 0 || totalTypingTime < 0) {
            throw  Error("time params is less than 0")
        }
        var from = Blockchain.transaction.from;

        var results = this.userResults.get(from);
        if (!results) {
            results = new Results();
            results.successfulWords = successfulWords;
            results.totalWords = totalWords;
            results.forgottenWords = forgottenWords;
            results.totalWatchingTime = totalWatchingTime;
            results.totalStartTypeTime = totalStartTypeTime;
            results.totalTypingTime = totalTypingTime;
        }
        else {
            results.successfulWords += successfulWords;
            results.totalWords += totalWords;
            results.forgottenWords += forgottenWords;
            results.totalWatchingTime += totalWatchingTime;
            results.totalStartTypeTime += totalStartTypeTime;
            results.totalTypingTime += totalTypingTime;
        }
        this.userResults.put(from, results);
        return {'userResults': this.userResults.get(from)}
    },
    getUserResults: function () {
        var from = Blockchain.transaction.from;
        var results = this.userResults.get(from) || new Results();
        return {'userResults': results}
    }
};
module.exports = WordGame;