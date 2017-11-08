
const aws = require( './aws-wrapper' );
const co = require( 'co' );

function* inflate( obj, region ) {
    const inflatedObject = {};

    if ( Array.isArray( obj ) ) {
        arrayResult = [];
        for( item of obj ) {
            arrayResult.push( ( yield inflate( item, region ) ) );
        }
        return arrayResult;
    }

    for( key in obj ) {
        const val = obj[ key ];
        if ( typeof val === 'object' ) {
            inflatedObject[ key ] = yield inflate( val, region );
            continue;
        } else {
            if ( key === key.toUpperCase() && 
                   typeof val === 'string' ) {
                inflatedObject[ key.toLowerCase() ] = yield aws.getSSMValue( val, region );
                continue;
            }
        }

        inflatedObject[ key ] = val;
    }

    return inflatedObject;
}

module.exports = ( configObj, region = process.env.AWS_REGION ) => {
    return co( function* execute() {
        return yield inflate( configObj, region );
    } ).catch( ( err ) => {
        throw new Error(`SSM Config Error: ${err.message}` );
    } );
}