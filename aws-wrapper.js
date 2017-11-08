
const aws = require( 'aws-sdk' )

module.exports = {
    getSSMValue: ( key, region ) => {
        const ssm = new aws.SSM({ apiVersion: '2014-11-06', region: region });
        return ssm.getParameter({
            Name: key
        } ).promise().then( ( res ) => {
            return res.Parameter.Value;
        } );
    }
}