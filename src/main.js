const mc = require('minecraft-protocol');

const BASE_NAME = "0xcyborg";

const HOST = "SERVER_HOSTNAME_OR_IP";
const PORT = 25565;

const ITERATIONS = 100;
const CONCURRENCY = 10;

const MESSAGES_PER_BOT = 10;
const MESSAGE_INTERVAL_MS = 25;

let active = 0;
let launched = 0;
let completed = 0;

function randomName() {
    return BASE_NAME + (Math.random().toString(36).slice(2, 10));
}

function startOne() {
    active++;
    launched++;

    const client = mc.createClient({
        host: HOST,
        port: PORT,
        username: randomName()
    });

    function done() {
        active--;
        completed++;

        if (launched < ITERATIONS) {
            startOne();
        }

        if (completed === ITERATIONS) {
            process.exit(0);
        }
    }

    client.once('login', async () => {
        const password = randomName();

        let content = `/register ${password} ${password}`;
        client.chat(content);

        content = `${BASE_NAME} is testing the server`;

        for (let i = 0; i < MESSAGES_PER_BOT; i++) {
            client.chat(content);

            await new Promise(r => setTimeout(r, MESSAGE_INTERVAL_MS));
        }

        client.end();
    });

    
    client.once('end', done);
    client.once('error', done);
}

function bootstrap() {
    for (let i = 0; i < CONCURRENCY && i < ITERATIONS; i++) {
        startOne();
    }
}

bootstrap();