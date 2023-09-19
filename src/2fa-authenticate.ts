import Auth2fa, { CommandHandler } from "./Auth2fa";
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const onAuthGen: CommandHandler = (options) => {
    const { name, width } = options;

    let widthNum = parseInt(width, 10) ?? 0;
    widthNum = isNaN(widthNum) ? 0 : widthNum;

    const secret = speakeasy.generateSecret({
        name
    })

    const { ascii, otpauth_url: otpauthUrl } = secret;

    let qrOptions = widthNum ? { width: widthNum } : {}
    qrcode.toDataURL(otpauthUrl as string, qrOptions, (err, data) => {
        if (err) {
            console.error(err);
        }
        // console.log(data);
        console.log(JSON.stringify({ secret: ascii, qrcode: data }));
    })
}

const onVerify: CommandHandler = (token, options) => {
    const { secret, window } = options;
    let windowNum = parseInt(window, 10) ?? 1;
    windowNum = isNaN(windowNum) ? 1 : windowNum;
    // console.log({ windowNum })

    const verified = speakeasy.totp.verify({
        secret,
        encoding: 'ascii',
        token,
        window: windowNum,
    });
    console.log(JSON.stringify({ verified }));
    // console.log(`verify = ${verified}, ${token}, ${options.secret}`);
}

new Auth2fa(onAuthGen, onVerify);
