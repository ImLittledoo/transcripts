const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
    const commands = [];
    const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log('🔁 Refreshing application commands...');
        await rest.put(
            // ✅ USE THIS
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log('✅ Successfully registered application commands.');
    } catch (err) {
        console.error('❌ Failed to register commands:', err);
    }
};
