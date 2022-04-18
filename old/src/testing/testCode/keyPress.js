/*
function pk() {
    // async 
    const readline = require('readline');
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    } else {
        console.log(`You pressed the "${str}" key`);
        console.log();
        console.log(key);
        console.log();
        process.exit();
        return key;
    }
    });
    console.log('Press any key...');


}



const k = pk();
console.log('im safe : you pressed', k);




class KeyListener{

    static interface = {
        terminal: this.Terminal,
        web: this.Web
    }
    
    constructor(which) {

        this.on = null;
        if (which === 'terminal') {
            this.on = this.Terminal;
        } else {
            this.on = null;
        }
    }

    class Terminal {

        contructor() {
            this.readline = require('readline');
            this.readline.emitKeypressEvents(process.stdin);
            process.stdin.setRawMode(true);

        }

        f(str, key) {
            
            if (key.ctrl && key.name === 'c') {
                process.exit();
            } else {
                console.log(`You pressed the "${str}" key`);
                console.log();
                console.log(key);
                console.log();
            }
        }

        const readline = require('readline');
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        } else {
            console.log(`You pressed the "${str}" key`);
            console.log();
            console.log(key);
            console.log();
        }
        });
        console.log('Press any key...');
    }

    Web() {
        ;
    }
};