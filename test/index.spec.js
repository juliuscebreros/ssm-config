
require( 'should' );
const sinon = require( 'sinon' );

const aws = require( '../aws-wrapper' );
const ssmConfig = require( '../index' );

describe( 'SSM-Config Main Test', () => {
    let ssmStub;
    let fixture;

    beforeEach(() => {
        ssmStub = sinon.stub(aws, 'getSSMValue' ).callsFake( ( key ) => {
            return Promise.resolve(`replaced${key}`);
        });
        fixture = {
            simpleKey: 'keyValue',
            CAPSKEY: 'testparam-1123'
        }
    } );

    afterEach(() => {
        ssmStub.restore();
    } );

    it( '- Should replace all caps properties', () => {
        const result = ssmConfig(fixture);

        return ssmConfig( fixture ).then(( res ) => {
            res.simpleKey.should.equal( fixture.simpleKey );
            res.capskey.should.equal(`replaced${fixture.CAPSKEY}` );
        } );
    } );

    it( '- Should replace nested keys', () => {
        fixture = {
            x: {
                NESTED1: 'thisisanestedvalue',
                CAPPED: {
                    NESTED2: 'thisisanothernestedvalue'
                }
            }
        };

        return ssmConfig( fixture ).then((res) => {
            res.x.nested1.should.equal( `replaced${fixture.x.NESTED1}` );
            res.x.CAPPED.nested2.should.equal( `replaced${fixture.x.CAPPED.NESTED2}` );
        } );
    } );

    it( '- Should replace keys inside arrays', () => {
        fixture = {
            x: [{
                KEYA: 'testa',
                KEYB: 'testb'
            }, {
                KEYC: 'testc',
                KEYD: 'testd'
            }]
        };

        return ssmConfig( fixture ).then((res) => {
            res.x[ 0 ].should.eql({
                keya: 'replacedtesta',
                keyb: 'replacedtestb'
            });
        } );
    } );

    it( '- Should return a failed promise if call to ssm failed', () => {
        ssmStub.restore();
        ssmStub = sinon.stub( aws, 'getSSMValue' ).callsFake( () => {
            return Promise.reject( `Error` );
        } );

        return ssmConfig( fixture ).catch( ( result ) => {
            result.message.should.startWith( 'SSM Config Error' );
        } );
    } );
} );
