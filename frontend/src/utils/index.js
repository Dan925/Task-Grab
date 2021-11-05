
const Utils = (function (){

    const validateEmail = (val)=>{
        const r = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (r.test(val))
            return true;
        return false
    }
    const validatePassword = (val)=>{
        if( val==="" || val.length<6)
            return false;
        return true;
    }
    return {
        validateEmail,
        validatePassword,
    };

})();

export default Utils;
