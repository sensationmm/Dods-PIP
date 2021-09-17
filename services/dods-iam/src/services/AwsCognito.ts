import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails, ISignUpResult } from 'amazon-cognito-identity-js';
import { config } from "../domain";

export class AwsCognito {
    userPool: CognitoUserPool;

    static defaultInstance: AwsCognito = new AwsCognito(config.aws.resources.cognito.userPoolId, config.aws.resources.cognito.clientId);

    constructor(userPoolId: string, clientId: string) {
        this.userPool = new CognitoUserPool({ UserPoolId: userPoolId, ClientId: clientId });
    }

    signUp(userName: string, password: string): Promise<ISignUpResult | undefined> {

        const attributeList = [new CognitoUserAttribute({ Name: "email", Value: userName }), new CognitoUserAttribute({ Name: "name", Value: userName })];

        return new Promise((resolve, reject) => {
            this.userPool.signUp(userName, password, attributeList, [], function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    signIn(userName: string, password: string): Promise<Record<string, any>> {

        const authenticationDetails = new AuthenticationDetails({ Username: userName, Password: password });

        const cognitoUser = new CognitoUser({ Username: userName, Pool: this.userPool });

        return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: async (result) => {
                    const accessToken: string = result.getAccessToken().getJwtToken();
                    const idToken: string = result.getIdToken().getJwtToken();
                    const refreshToken: string = result.getRefreshToken().getToken();

                    resolve({ accessToken, idToken, refreshToken, userName });
                },
                onFailure: async (err) => {

                    reject(err);
                }
            });
        });
    }

    signOut(userName: string): Promise<void> {
        const cognitoUser = new CognitoUser({ Username: userName, Pool: this.userPool });

        return new Promise((resolve) => {
            cognitoUser.signOut(() => {
                resolve();
            });
        });
    }

    changePassword(userName: string, password: string, newPassword: string) {

        const authenticationDetails = new AuthenticationDetails({ Username: userName, Password: password });

        const cognitoUser = new CognitoUser({ Username: userName, Pool: this.userPool });

        return new Promise((resolve, reject) => {

            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    cognitoUser.changePassword(password, newPassword, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                },
                onFailure: function (err) {
                    reject(err);
                }
            });
        });
    }

    resetPassword(userName: string, newPassword: string, verificationCode: string) {

        const cognitoUser = new CognitoUser({ Username: userName, Pool: this.userPool });

        return new Promise((resolve, reject) => {
            cognitoUser.confirmPassword(verificationCode, newPassword, {
                onSuccess() {
                    resolve("SUCCESS");
                },
                onFailure(err) {
                    reject(err);
                },
            });
        });
    }

    forgotPassword(userName: string) {

        const cognitoUser = new CognitoUser({ Username: userName, Pool: this.userPool });

        return new Promise((resolve, reject) => {
            cognitoUser.forgotPassword({
                onSuccess: function (data) {
                    resolve(data);
                },
                onFailure: function (err) {
                    reject(err);
                },
                //Optional automatic callback
                // inputVerificationCode: function (data) {
                //     console.log('Code sent to: ' + data);
                //     const verificationCode = "";

                //     cognitoUser.confirmPassword(verificationCode, newPassword, {
                //         onSuccess() {
                //             resolve('Password confirmed!');
                //         },
                //         onFailure(err) {
                //             reject('Password not confirmed!');
                //         },
                //     });
                // }
            });
        });
    }

    resendConfirmationCode(userName: string) {

        const cognitoUser = new CognitoUser({ Username: userName, Pool: this.userPool });

        return new Promise((resolve, reject) => {
            cognitoUser.resendConfirmationCode(function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    confirmRegistration(userName: string, verificationCode: string) {

        const cognitoUser = new CognitoUser({ Username: userName, Pool: this.userPool });

        return new Promise((resolve, reject) => {
            cognitoUser.confirmRegistration(verificationCode, true, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    getUserData(accessToken: string) {
        const params = { AccessToken: accessToken };

        const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider();

        return new Promise((resolve, reject) => {
            cognitoidentityserviceprovider.getUser(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    deleteUser(userName: string, password: string) {
        const authenticationDetails = new AuthenticationDetails({ Username: userName, Password: password });

        const cognitoUser = new CognitoUser({ Username: userName, Pool: this.userPool });

        return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    cognitoUser.deleteUser((err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                },
                onFailure: function (err) {
                    reject(err);
                }
            });
        });
    }

    disableUser(userName: string) {
        var params = {
            UserPoolId: config.aws.resources.cognito.userPoolId, /* required */
            Username: userName /* required */
        };

        const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider();

        return new Promise((resolve, reject) => {
            cognitoidentityserviceprovider.adminDisableUser(params, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    enableUUser(userName: string) {
        var params = {
            UserPoolId: config.aws.resources.cognito.userPoolId, /* required */
            Username: userName /* required */
        };

        const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider();

        return new Promise((resolve, reject) => {
            cognitoidentityserviceprovider.adminEnableUser(params, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}