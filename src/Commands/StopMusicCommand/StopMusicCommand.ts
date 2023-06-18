import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import LoggingService from "../../services/Logging/LoggingService";
import BaseCommand from "../BaseCommand/BaseCommand";

class StopMusicCommand extends BaseCommand {
    private LOGGER: LoggingService;

    constructor() {
        super("stopmusic", "stops music");
        this.data
            .setName(this.name)
            .setDescription(this.description);
        this.LOGGER = new LoggingService();
    }

    async execute(interaction: CommandInteraction) {
        const connection = getVoiceConnection(interaction.guildId);

        if (connection) {
            connection.disconnect();
            interaction.reply("Stopped playing audio");
        } else {
            interaction.reply("no audio is playing to stop");
        }
    }
}

export default StopMusicCommand;