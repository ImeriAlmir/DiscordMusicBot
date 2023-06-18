import { SlashCommandBuilder, CommandInteraction } from "discord.js";
class BaseCommand {
    public data: SlashCommandBuilder;
    public name: string;
    public description: string;
    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        this.data = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description);
    }

    async execute(interaction: CommandInteraction) {

    }
}

export default BaseCommand;