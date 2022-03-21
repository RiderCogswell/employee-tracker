// checks to make sure that an object has the required properties
module.exports = function(obj, ...props) {
    const errors = [];

    props.forEach((prop) => {
        // if property is blank or doesnt exist, add to errors array
        if (obj[prop] === undefined || obj[prop] === '') {
            errors.push(`No ${prop} specified.`);
        }
    })

    if (errors.length) {
        return {
            error: errors.join(' ')
        };
    }
    
    return null;
}