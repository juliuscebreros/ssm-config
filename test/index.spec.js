
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
                KEYB: 'testb',
                moreNest: [
                    {
                        url: 'xxx',
                        NAME: 'testa'
                    }
                ]
            }, {
                KEYC: 'testc',
                KEYD: 'testd'
            }]
        };

        return ssmConfig( fixture ).then((res) => {
            res.x[ 0 ].keya.should.equal( `replaced${fixture.x[0].KEYA}` );
            res.x[ 0 ].moreNest[ 0 ].name.should.equal( `replaced${fixture.x[0].moreNest[0].NAME}` );
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

    it( '- Should return the values inside an array', () => {
        fixture = {
            "s3Bucket": "r2-qa-ics-licensing-report",
            "email": {
                "sender": "ICS.Shipments@invenco.com",
                "recipients": [ "john.duneas@invenco.com", "asecondperson@invenco.com" ]
            }
        };

        return ssmConfig( fixture ).then( ( res ) => {
            res.email.recipients[ 0 ].should.equal( fixture.email.recipients[ 0 ] );
            res.email.recipients[ 1 ].should.equal( fixture.email.recipients[ 1 ] );
        } )
    } );
} );
