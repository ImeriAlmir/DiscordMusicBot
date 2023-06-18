require('dotenv').config();
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import LoggingService from "../../services/Logging/LoggingService";
import { createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import ytdl from "ytdl-core";
import BaseCommand from "../BaseCommand/BaseCommand";
class PlayMusicCommand extends BaseCommand {

    private LOGGER: LoggingService;
    private GUILD_ID: string = process.env.GUILD_ID || "";
    private CHANNEL_ID: string;

    constructor() {
        super("playmusic", "plays music UPDATED");
        this.data
            .addStringOption((option) =>
                option
                    .setName('youtubeurl123')
                    .setDescription('YouTube URL of the music 123123123123123')
                    .setRequired(true)
            );
        this.LOGGER = new LoggingService();
    }

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