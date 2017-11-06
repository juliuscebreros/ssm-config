
const aws = require( './aws-wrapper' );
const co = require( 'co' );

function* inflate( obj ) {
    const inflatedObject = {};
    for( key in obj ) {
        const val = obj[ key ];
        if ( typeof val === 'object' ) {
            inflatedObject[ key ] = yield inflate( val );
            continue;
        } else {
            if ( key === key.toUpperCase() && 
                   typeof val === 'string' ) {
                inflatedObject[ key.toLowerCase() ] = yield aws.getSSMValue( val );
                continue;
            }
        }

        inflatedObject[ key ] = val;
    }

    return inflatedObject;
}

module.exports = ( configObj ) => {
    return co( function* execute() {
        return yield inflate( configObj );
    } ).catch( ( err ) => {
        throw new Error(`SSM Config Error: ${err.message}` );
    } );
}