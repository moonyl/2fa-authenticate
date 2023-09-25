import { Command } from "commander";

type CommandHandler = (...args: any[]) => void | Promise<void>

class Auth2fa {
    private program: Command;

    constructor(onAuthGen: CommandHandler,
        onVerify: CommandHandler,
        onQrcode: CommandHandler
    ) {
        this.program = new Command();

        this.program
            .command('gen')
            .description('QR Code 및 비밀키를 생성합니다. secret 형식은 base32')
            .action(onAuthGen);

        this.program
            .command('verify [token]')
            .description('토큰을 검증합니다. secret 형식은 base32')
            .option('-s,--secret <secretKey>', '검증을 위한 비밀키')
            .option('-W,--window <window>', "verify 허용 시간 범위(30초 단위), 기본값: 1(60초)", "1")
            .action(onVerify);

        this.program
            .command('qrcode [secret]')
            .description('QR code를 생성합니다. secret 형식은 base32')
            .option('-w,--width <width>', "QR code 너비")
            .option('-n,--name <name>', 'authenticator에 표시될 이름', "Secret")
            .action(onQrcode);

        this.program.parse(process.argv);
    }
}

export default Auth2fa;
export { CommandHandler };