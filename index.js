/*
 * rpg-library-slack
 *
 * Copyright (c) 2016 Thomas Baumbach <tom@xolo.pw>
 *
 * Licensed under the MIT License
 */

'use strict';

var FileSystem = require('fs'),
    SlackRobot = require('slack-robot'),
    SlackRPG = require('rpg-library'),
    rpg = SlackRPG.createRPG(),
    configpath = process.cwd()+'/config.json',
    config = readJSON(configpath),
    robot = new SlackRobot(config.apitoken);

function readJSON(filename) {
    try {
        return JSON.parse(FileSystem.readFileSync(filename, 'utf8'));
    } catch (error) {
        console.error('error reading', filename, '@', process.cwd(), error);
    }
};

function message(msg) {
    // TODO: use 'arguments'
    robot.to(config.channel, function(res) {
        console.log(msg);
        res.text('```✨ '+msg+'```');
        return res.send();
    });
};

function error(error) {
    var msg = 'error: '+error+(error.stack ? '\n'+error.stack : '')+'```';
    message(msg);
};

robot._rtm.on('authenticated', function() {

    message('Stay awhile and listen...');

    /*
     * BOT: RPG commands
     */
    robot.listen(config.prefix+' +:cmd([\\S ]+)', function(req, res) {
        try {
            console.log(req.user.name+'$', req.params.cmd);
            rpg.parse(req.user.name, req.params.cmd.trim(), message);
        } catch(error) {
            error(error);
        }
    });

    /*
     * BOT: error listener
     */
    robot.on('error', function(error) {
        error(error);
    });
});

robot.start();
