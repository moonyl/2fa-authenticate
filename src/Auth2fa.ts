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
            .action(onAuthGen);

        this.program
            .command('verify [token]')
            .description('토큰을 검증합니다.')
            .option('-s,--secret <secretKey>', '검증을 위한 비밀키')
            .action(onVerify);

        this.program.parse(process.argv);
    }
}

export default Auth2fa;
export { CommandHandler };