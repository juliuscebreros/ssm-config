
const aws = require( 'aws-sdk' )

module.exports = {
    getSSMValue: ( key, region ) => {
        const defaultRegion = region || aws.config.region; 
        const ssm = new aws.SSM({ apiVersion: '2014-11-06', region: defaultRegion });
        return ssm.getParameter({
            Name: key,
            WithDecryption: true
        } ).promise().then( ( res ) => {
            return res.Parameter.Value;
        } );
    }
}