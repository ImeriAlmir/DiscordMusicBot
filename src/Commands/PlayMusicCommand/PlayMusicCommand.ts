require('dotenv').config();
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import LoggingService from "../../services/Logging/LoggingService";
import { createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import ytdl from "ytdl-core";
class PlayMusicCommand {

    private LOGGER: LoggingService;
    public name: string = "playmusic";
    public description: string = "play music";
    private GUILD_ID: string = process.env.GUILD_ID || "";
    private CHANNEL_ID: string;

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

        const connection = getVoiceConnection(this.GUILD_ID);

        const query = interaction.options.get("youtubeurl").value.toString();
        const videoInfo = await ytdl.getInfo(query);
        const stream = ytdl(videoInfo.videoDetails.video_url, { filter: 'audioonly' });
        const audioPlayer = createAudioPlayer();
        const resource = createAudioResource(stream);

        if (!connection) {
            const newConnection = joinVoiceChannel({
                channelId: "1119016158113321023",
                guildId: this.GUILD_ID,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });
            newConnection.subscribe(audioPlayer);
        } else {
            connection.subscribe(audioPlayer);
        }

        audioPlayer.play(resource);

        interaction.reply("" + interaction.options.get("youtubeurl")?.value);
    }
}

export default PlayMusicCommand;