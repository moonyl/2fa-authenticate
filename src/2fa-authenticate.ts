import Auth2fa, { CommandHandler } from "./Auth2fa";
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const onAuthGen: CommandHandler = (options) => {
    const { name: label, algo, period, width } = options;
    // console.log({ algo });

    let periodNum = parseInt(period, 10) ?? 60;
    periodNum = isNaN(periodNum) ? 60 : periodNum;

    let widthNum = parseInt(width, 10) ?? 0;
    widthNum = isNaN(widthNum) ? 0 : widthNum;
    // console.log({ periodNum, widthNum });

    const secret = speakeasy.generateSecretASCII();
    // console.log({ secret })
    const otpauthUrl = speakeasy.otpauthURL({ secret, label, algorithm: algo, period: periodNum })

    let qrOptions = widthNum ? { width: widthNum } : {}
    qrcode.toDataURL(otpauthUrl as string, qrOptions, (err, data) => {
        if (err) {
            console.error(err);
        }
        // console.log(data);
        console.log(JSON.stringify({ secret, qrcode: data }));
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
