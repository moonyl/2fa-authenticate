import Auth2fa, { CommandHandler } from './Auth2fa';
class Auth2faBuilder {
    private onAuthGen: CommandHandler | undefined;
    private onVerify: CommandHandler | undefined;
    private onQrcode: CommandHandler | undefined;

    setOnAuthGen(onAuthGen: CommandHandler): Auth2faBuilder {
        this.onAuthGen = onAuthGen;
        return this;
    }

    setOnVerify(onVerify: CommandHandler): Auth2faBuilder {
        this.onVerify = onVerify;
        return this;
    }

    setOnQrcode(onQrcode: CommandHandler): Auth2faBuilder {
        this.onQrcode = onQrcode;
        return this;
    }

    build(): Auth2fa {
        if (!this.onAuthGen || !this.onVerify || !this.onQrcode) {
            throw new Error('Missing required parameters');
        }

        return new Auth2fa(this.onAuthGen, this.onVerify, this.onQrcode);
    }
}

export default Auth2faBuilder;