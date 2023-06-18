import { Guild } from "discord.js";

export async function clearCommands(guild: Guild) {
    const existingsCommands = await guild.commands.fetch();
    existingsCommands.forEach(async (command) => {
        await command.delete();
    });
}
