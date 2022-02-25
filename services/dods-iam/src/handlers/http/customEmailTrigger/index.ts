//const AWS = require('aws-sdk');
//const b64 = require('base64-js');
const encryptionSdk = require('@aws-crypto/client-node');

import AWS from "aws-sdk"
import b64 from "base64-js";

//Configure the encryption SDK client with the KMS key from the environment variables.

const { encrypt, decrypt } = encryptionSdk.buildClient(encryptionSdk.CommitmentPolicy.REQUIRE_ENCRYPT_ALLOW_DECRYPT);
const generatorKeyId = process.env.KEY_ALIAS;
const keyIds = [process.env.KEY_ID];
const keyring = new encryptionSdk.KmsKeyringNode({ generatorKeyId, keyIds })
console.log(encrypt);
console.log(AWS);
exports.handle = async (event: any) => {
    console.log('-------> event ----');
    console.log(event);
    // Decrypt the secret code using encryption SDK.
    let plainTextCode;
    if (event.request.code) {
        const { plaintext, messageHeader } = await decrypt(keyring, b64.toByteArray(event.request.code));
        console.log(messageHeader);
        plainTextCode = plaintext
        console.log(`Decrypted info ----> ${plainTextCode}`);
    }

    //PlainTextCode now has the decrypted secret.

    if (event.triggerSource == 'CustomEmailSender_SignUp') {
        console.log('fake email sended');
        //Send email to end-user using custom or 3rd party provider.
        //Include temporary password in the email.

    } else if (event.triggerSource == 'CustomEmailSender_ResendCode') {

    } else if (event.triggerSource == 'CustomEmailSender_ForgotPassword') {

    } else if (event.triggerSource == 'CustomEmailSender_UpdateUserAttribute') {

    } else if (event.triggerSource == 'CustomEmailSender_VerifyUserAttribute') {

    } else if (event.triggerSource == 'CustomEmailSender_AdminCreateUser') {
        console.log('User created !!');

    } else if (event.triggerSource == 'CustomEmailSender_AccountTakeOverNotification') {

    }

    return;
};