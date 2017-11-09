const aws = require('aws-sdk');

const ssmConfig = require( './index' );

ssmConfig({
    test: 'SOMETHING',
    SOMETHING: 'something'
});