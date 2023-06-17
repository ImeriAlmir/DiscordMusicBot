require('dotenv').config();
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import LoggingService from "../../services/Logging/LoggingService";
import { joinVoiceChannel, DiscordGatewayAdapterCreator } from "@discordjs/voice";
class PlayMusicCommand {

    private LOGGER: LoggingService;
    public name: string = "playmusic";
    public description: string = "play music";
    private GUILD_ID: string = process.env.GUILD_ID || "";
    private CHANNEL_ID: string = process.env.CHANNEL_ID || "";

    constructor() {
        this.LOGGER = new LoggingService();
    }

    public data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
            option
                .setName('youtubeurl')
                .setDescription('YouTube URL of the music')
                .setRequired(true)
        );

    async execute(interaction: CommandInteraction) {
        const member = interaction.member;
        if (!member) {
            interaction.reply('You must be in a server to use this command.');
            return;
        }

        interaction.reply("" + interaction.options.get("youtubeurl")?.value);
    }
}

export default PlayMusicCommand;