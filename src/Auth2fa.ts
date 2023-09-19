import { Command } from "commander";

type CommandHandler = (...args: any[]) => void | Promise<void>

class Auth2fa {
    private program: Command;

    constructor(onAuthGen: CommandHandler, onVerify: CommandHandler) {
        this.program = new Command();

        this.program
            .command('gen')
            .description('QR Code 및 비밀키를 생성합니다.')
            .option('-n,--name <name>', 'authenticator에 표시될 이름')
            .option('-a,--algo <algorithm>', "생성시 적용할 알고리즘.", "sha256")
            .option('-w,--width <width>', "QR code 너비")
            .option('-p,--period <period>', "TOTP의 유효 기간(초)", "60")
            .action(onAuthGen);

        this.program
            .command('verify [token]')
            .description('토큰을 검증합니다.')
            .option('-s,--secret <secretKey>', '검증을 위한 비밀키')
            .option('-W,--window <window>', "verify 허용 시간 범위(30초 단위), 기본값: 1(60초)", "1")
            .option('-a,--algo <algorithm>', "검증시 적용할 알고리즘.", "sha256")
            .action(onVerify);

        this.program.parse(process.argv);
    }
}

export default Auth2fa;
export { CommandHandler };