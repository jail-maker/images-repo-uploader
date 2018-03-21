#!/usr/bin/env node

'use strict';

const fs = require('fs');
const request = require('request-promise-native');
const minimist = require('minimist');

const ARGV = minimist(process.argv.slice(2));

if (!ARGV.name) throw new Error('argument name is empty');
if (!ARGV.file) throw new Error('argument file is empty');

const {
    name:IMG_NAME,
    file:FILE,
    parent:PARENT = null,
    version:VERSION = '0.0.1',
    maintainer:MAINTAINER = null,
    repo:REPO = 'http://127.0.0.1:3000',
} = ARGV;

(async _ => {

    try {

        await request({
            method: 'POST',
            json: true,
            uri:  `${REPO}/images`,
            body: {
                name: IMG_NAME,
                maintainer: MAINTAINER,
                version: VERSION,
                parent: PARENT,
            },
        });

    } catch (error) {

        if (error.statusCode !== 409) throw error;

    }

    await request({
        method: 'PUT',
        uri:  `${REPO}/images/${IMG_NAME}/data`,
        formData: {
            data: fs.createReadStream(FILE),
        }
    });

})();
