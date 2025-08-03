const { Client, GatewayIntentBits, Partials, Events, REST, Routes, SlashCommandBuilder } = require('discord.js');
const keepAlive = require('./server');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const canalAvisoID = "1384059141257171005";
const palabrasProhibidas = ["nazi", "hitler"];

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde con Pong!')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    console.log('📦 Registrando comandos slash...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('✅ Comandos registrados correctamente.');
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error);
  }
})();

client.once(Events.ClientReady, () => {
  console.log(`✅ Bot iniciado como ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('🏓 Pong!');
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.guild || !message.member || !message.content) return;

  const contenido = message.content.toLowerCase();

  if (palabrasProhibidas.some(palabra => contenido.includes(palabra))) {
    try {
      await message.delete();

      if (message.member.moderatable) {
        await message.member.timeout(2 * 60 * 1000, 'Palabra prohibida detectada');

        const canal = client.channels.cache.get(canalAvisoID);
        if (canal) {
          canal.send(`🚫 El usuario <@${message.author.id}> fue muteado por 2 minutos por usar una palabra prohibida.`);
        }
      } else {
        console.warn(`⚠️ No se pudo mutear a ${message.author.tag}.`);
      }
    } catch (error) {
      console.error('❌ Error al intentar mutear:', error);
    }
  }
});

client.login(TOKEN);
keepAlive();
