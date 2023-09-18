import Auth2fa, { CommandHandler } from "./Auth2fa";
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const onAuthGen: CommandHandler = (options) => {
    const { name: label, algorithm } = options;

    const secret = speakeasy.generateSecretASCII();
    // console.log({ secret })
    const otpauthUrl = speakeasy.otpauthURL({ secret, label, algorithm })

    qrcode.toDataURL(otpauthUrl as string, (err, data) => {
        if (err) {
            console.error(err);
        }
        // console.log(data);
        console.log(JSON.stringify({ secret, qrcode: data }));
    })
}

const onVerify: CommandHandler = (token, options) => {
    const { secret, algorithm } = options;

    const verified = speakeasy.totp.verify({
        secret,
        encoding: 'ascii',
        token,
    });
    console.log(JSON.stringify({ verified }));
    // console.log(`verify = ${verified}, ${token}, ${options.secret}`);
}

new Auth2fa(onAuthGen, onVerify);
