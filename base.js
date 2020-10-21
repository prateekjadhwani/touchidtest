let supportsPublicCreds = false;
let serverChallenge = new Uint8Array('a45r'.split(''));
let serverChallenge2 = new Uint8Array('ae5r'.split(''));


const check = () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential
    // isUserVerifyingPlatformAuthenticatorAvailable() tells you if you can use a platform to authenticate the user
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    .then((isAvailable) => {
        
        // Set message to green color
        document.querySelector('.check-container').classList.add('check-container--green');
        document.querySelector("#checkcontainer").innerText = 'Your system allows use of Touch ID / Face Id';
        supportsPublicCreds = true;

        if(!!localStorage.getItem('userid')) {
            document.querySelector('.touchid-container').classList.remove('hidden');
            document.querySelector('.login-container').classList.add('hidden');
            document.querySelector('#touchidLoginContainer button').innerText = `${localStorage.getItem('userid')}, login via touch id`;
        }
    })
    .catch(e => {
        document.querySelector("#checkcontainer").innerText = 'Your system does not allow use of Touch ID / Face Id';
        document.querySelector('.check-container').classList.add('check-container--red');
    });
};

const binToStr = (bin) => {
    return btoa(new Uint8Array(bin).reduce(
        (s, byte) => s + String.fromCharCode(byte), ''
    ));
}

function strToBin(str) {
    return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

const login = () => {
    console.log("Login called");
    handleSuccessFulLogin();
}

const showUserLoginWithFields = () => {
    document.querySelector('.touchid-container').classList.add('hidden');
    document.querySelector('.login-container').classList.remove('hidden');
}

const loginFromTouchId = () => {
    const options = {
        publicKey: {
            challenge: serverChallenge2,
            allowCredentials: [{
                type: 'public-key',
                id: strToBin(localStorage.getItem('idBuffer')),
                transports: ['internal'],
            }],
            userVerification: 'preferred'
        }
    };

    navigator.credentials.get(options)
    .then((credentialInfoAssertion) => {
        console.log('credentialInfoAssertion', credentialInfoAssertion);
        showContent();
    }).catch(function (err) {
        console.error(err);
    });
}

const startTouchIdRegistration = () => {
    const options = {
        publicKey: {
            rp: { name: 'https://prateekjadhwani.github.io/touchidtest/' },
            user: {
                name: document.querySelector('[name=userid]').value,
                id: new Uint8Array(16),
                displayName: document.querySelector('[name=userid]').value
            },
            identifier: 'username',
            pubKeyCredParams: [ { type: 'public-key', alg: -7 }],
            challenge: serverChallenge,
            authenticatorSelection: { authenticatorAttachement: 'platform' }
        }
    };

    navigator.credentials.create(options)
    .then(function (newCredentialInfo) {
        console.log(newCredentialInfo);
        var response = newCredentialInfo.response;
        console.log(response);
        var clientExtensionsResults = newCredentialInfo.getClientExtensionResults();
        console.log(clientExtensionsResults);

        localStorage.setItem('userid', document.querySelector('[name=userid]').value);
        localStorage.setItem('idBuffer', binToStr(newCredentialInfo.rawId));
        window.creds = newCredentialInfo;
        showContent();
    }).catch(function (err) {
        console.error(err);
    });
}

const handleSuccessFulLogin = () => {
    document.querySelector('.login-container').classList.add('hidden');
    document.querySelector('.login-success').classList.remove('hidden');
}

const showContent = () => {
    document.querySelector('.touchid-container').classList.add('hidden');
    document.querySelector('.login-container').classList.add('hidden');
    document.querySelector('.login-success').classList.add('hidden');
    document.querySelector('.content').classList.remove('hidden');
}

check();
