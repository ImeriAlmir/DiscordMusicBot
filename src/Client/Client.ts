require("dotenv").config();
import { Client, GatewayIntentBits, Events, Guild, CommandInteraction, Interaction } from "discord.js";
import LoggingService from "../services/Logging/LoggingService";
import MusicService from "../services/Music/MusicService";

export class DiscordBot {
    private static instance: DiscordBot;
    private client: Client;
    private BOT_TOKEN: string = process.env.BOT_TOKEN || "";
    private GUILD_ID: string = process.env.GUILD_ID || "";
    private guild: Guild | undefined;
    private LOGGER: LoggingService;
    private musicService: MusicService;

    public constructor() {
        this.LOGGER = new LoggingService();

        this.client = new Client({
            intents: [
                GatewayIntentBits.GuildVoiceStates,
            ]
        });

        this.guild = this.client.guilds.cache.get(this.GUILD_ID);
        this.musicService = new MusicService(this.guild);

        this.client.once(Events.ClientReady, async () => {
            this.guild = await this.client.guilds.fetch(this.GUILD_ID);
            this.musicService.setGuild(this.guild);
            this.LOGGER.info("BOT IS UP AND READY");
        });

        this.client.on(Events.InteractionCreate, async (interaction: Interaction) => {
            this.musicService.handleInteraction(interaction as CommandInteraction);
        });
    }

    public static getInstance(): DiscordBot {
        if (!DiscordBot.instance) {
            DiscordBot.instance = new DiscordBot();
        }

        return DiscordBot.instance;
    }

    public async start() {
        await this.musicService.registerCommands();
        this.client.login(this.BOT_TOKEN);
    }

}