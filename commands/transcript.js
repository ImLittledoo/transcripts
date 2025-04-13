const { SlashCommandBuilder } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transcript')
        .setDescription('Generates an HTML transcript of this channel'),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // Check if interaction is from a valid text channel
        if (!interaction.channel || !interaction.channel.name) {
            return interaction.followUp({ content: '❌ You must use this command in a text channel!', ephemeral: true });
        }

        try {
            const transcriptPath = path.join(__dirname, '../transcripts');
            if (!fs.existsSync(transcriptPath)) {
                fs.mkdirSync(transcriptPath, { recursive: true });
            }

            const transcript = await createTranscript(interaction.channel, {
                returnBuffer: false,
                fileName: `${interaction.channel.name}_transcript.html`
            });

            // Save the file to the transcripts directory
            const filePath = path.join(transcriptPath, `${interaction.channel.name}_transcript.html`);
            fs.writeFileSync(filePath, transcript);

            // Send back a link to access the file
            const transcriptUrl = `http://localhost:3000/transcripts/${interaction.channel.name}_transcript.html`;

            await interaction.followUp({
                content: `📝 Transcript generated. You can download or view it [here](${transcriptUrl}).`
            });

        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: '❌ Failed to generate transcript.', ephemeral: true });
        }
    }
};
