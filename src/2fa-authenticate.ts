import { CommandHandler } from "./Auth2fa";
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import Auth2faBuilder from "./Auth2faBuilder";

const envDirectory = Reflect.has(process, 'pkg') ? dirname(process.execPath) : process.cwd();
const envPath = join(envDirectory, '.env');
if (existsSync(envPath)) {
    process.loadEnvFile(envPath);
}

const onAuthGen: CommandHandler = (options) => {
    // const { name } = options;

    const secret = speakeasy.generateSecret()

    // console.log({ secret });
    const { base32 } = secret;
    // const url = speakeasy.otpauthURL({ secret: base32, label: name, encoding: 'base32' });
    // console.log("compare: ", { otpauth_url, url });
    console.log(JSON.stringify({ secret: base32 }));
}

const onVerify: CommandHandler = (token, options) => {
    const secret = options.secret ?? process.env.TOTP_SECRET;
    const { window } = options;
    if (!secret) {
        console.error("Provide --secret or set TOTP_SECRET in .env");
        process.exitCode = 1;
        return;
    }

    let windowNum = parseInt(window, 10) ?? 1;
    windowNum = isNaN(windowNum) ? 1 : windowNum;
    // console.log({ windowNum })

    const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: windowNum,
    });
    console.log(JSON.stringify({ verified }));
    // console.log(`verify = ${verified}, ${token}, ${options.secret}`);
}

const onQrcode: CommandHandler = (secret: string, options) => {
    const { width, name } = options;
    const secretValue = secret ?? process.env.TOTP_SECRET;
    if (!secretValue) {
        console.error("Provide a secret or set TOTP_SECRET in .env");
        process.exitCode = 1;
        return;
    }

    // console.log({ width, name });
    const otpauthUrl = `otpauth://totp/${name}?secret=${secretValue}`;

    let widthNum = parseInt(width, 10) ?? 0;
    widthNum = isNaN(widthNum) ? 0 : widthNum;

    let qrOptions = widthNum ? { width: widthNum } : {}
    qrcode.toDataURL(otpauthUrl, qrOptions, (err, data) => {
        if (err) {
            console.error(err);
        }
        // console.log(data);
        console.log(JSON.stringify({ qrcode: data }));
    })
}

new Auth2faBuilder()
    .setOnAuthGen(onAuthGen)
    .setOnVerify(onVerify)
    .setOnQrcode(onQrcode)
    .build();
