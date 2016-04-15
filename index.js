/*
 * rpg-slack
 *
 * Copyright (c) 2016 Thomas Baumbach tom@xolo.pw
 *
 * Licensed under the MIT License
 */

'use strict';

var SlackRobot = require('slack-robot'),
    configpath = './config.json',
    config = readConfig(configpath),
    robot = new SlackRobot(config.apitoken);

function readConfig(filename) { // returns undefined on error
    try {
        return JSON.parse(fs.readFileSync(filename, 'utf8'));
    } catch (error) {
        console.log('error reading', filename, '@', process.cwd(), error);
    }
};

function message(msg) {
    robot.to(config.channel, function(res) {
        res.text(msg);
        return res.send();
    });
};

robot._rtm.on('authenticated', function() {

    message('Stay awhile and listen...');

    /*
     * BOT: RPG commands
     */
    robot.listen(config.prefix+' +:cmd([\\S ]+)', function(req, res) {
        let command = req.params.cmd;

        //TODO:
    });

    /*
     * BOT: error listener
     */
    robot.on('error', function(error) {
        message("```" + error + "```");
        if (error.stack)
            message("```" + error.stack + "```");
        console.error(error);
    });
});

robot.start();
