require("dotenv").config();
import { Client, GatewayIntentBits, Events, Guild, Interaction } from "discord.js";
import LoggingService from "../services/Logging/LoggingService";
import PlayMusicCommand from "../Commands/PlayMusicCommand/PlayMusicCommand";

export class DiscordBot {
    private static instance: DiscordBot;
    private client: Client;
    private BOT_TOKEN: string = process.env.BOT_TOKEN || "";
    private GUILD_ID: string = process.env.GUILD_ID || "";
    private guild: Guild | undefined;
    private LOGGER: LoggingService;
    private playMusicCommand;

    public constructor() {
        this.LOGGER = new LoggingService();

        this.client = new Client({
            intents: [
                GatewayIntentBits.GuildVoiceStates,
            ]
        });

        this.playMusicCommand = new PlayMusicCommand();

        this.client.once(Events.ClientReady, () => {
            this.registerCommands();
            this.LOGGER.info("BOT IS UP AND READY");
        });

        this.client.on(Events.InteractionCreate, async (interaction: Interaction) => {
            if (!interaction.isCommand()) {
                this.LOGGER.info("not a command");
                return;
            }

            const { commandName } = interaction;

            if (commandName === this.playMusicCommand.name) {
                this.playMusicCommand.execute(interaction);
            }
        });
    }

    public static getInstance(): DiscordBot {
        if (!DiscordBot.instance) {
            DiscordBot.instance = new DiscordBot();
        }

        return DiscordBot.instance;
    }

    public start(): void {
        this.client.login(this.BOT_TOKEN);
    }

    private async registerCommands() {
        this.guild = this.client.guilds.cache.get(this.GUILD_ID);
        if (!this.guild) {
            this.LOGGER.error(`cannot find guild with id: ${this.guild}`);
        }

        try {
            await this.guild?.commands.create(this.playMusicCommand.data);
            this.LOGGER.info(`registred command ${this.playMusicCommand.name}`);
        } catch (error) {
            this.LOGGER.error(`error happend while registring command ${this.playMusicCommand.data}, with error: ${error}`);
        }
    }
}