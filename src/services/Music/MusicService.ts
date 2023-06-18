import { Guild, CommandInteraction } from "discord.js";
import StopMusicCommand from "../../Commands/StopMusicCommand/StopMusicCommand";
import PlayMusicCommand from "../../Commands/PlayMusicCommand/PlayMusicCommand";
import BaseCommand from "../../Commands/BaseCommand/BaseCommand";

class MusicService {
    private guild: Guild | undefined;
    private commands: BaseCommand[];

    constructor(guild: Guild) {
        this.guild = guild;
        this.commands = [
            new PlayMusicCommand(),
            new StopMusicCommand()
        ];
    }

    public async registerCommands() {
        try {
            const promises = this.commands.map((command) => {
                return this.guild?.commands.create(command.data);
            });
            await Promise.all(promises);
            console.log("******");
            console.log(await this.guild?.commands.fetch());
        }
        catch (error) {
            console.log(error);
        }
    }

    public handleInteraction(interaction: CommandInteraction) {

        console.log(this.commands);
        const command = this.commands.find((cmd) => {
            console.log("heree");
            cmd.name === interaction.commandName;
        });

        if (command) {
            command.execute(interaction);
        }
    }

    public setGuild(guild: Guild) {
        this.guild = guild;
    }
}

export default MusicService; 