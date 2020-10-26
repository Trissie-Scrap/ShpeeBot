const config = {
  // Bot Owner, level 10 by default. A User ID. Should never be anything else than the bot owner's ID.
  ownerID: "337009470666440705",

  // Bot Admins, level 9 by default. Array of user ID strings.
  admins: [],

  // Bot Support, level 8 by default. Array of user ID strings
  support: [],

  // Your Bot's Token. Available on https://discord.com/developers/applications/me
  token: process.env.TOKEN,

  // Intents the bot needs.
  // For join messages to work you need Guild Members, which is privileged and requires extra setup.
  // For more info about intents see: https://discordjs.guide/popular-topics/intents.html#enabling-intents
  intents: ["DIRECT_MESSAGES", "GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_INVITES", "GUILD_BANS"],

  // Bot status [online / idle / invisible / dnd]
  status: "online",

  // Bot status type [PLAYING / STREAMING / LISTENING / WATCHING]
  statusType: "PLAYING",

  // The game you want the bot to play. {{prefix}} is replaced with the default prefix below, {{guilds}} is replaced with the guild count and {{version}} is replaced with the bot version. Leave blank to disable
  playingGame: "{{prefix}}help | {{guilds}} guilds | v{{version}}",

  // An array of responses for the 8ball command
  eightBallResponses: [
    "Yes",
    "No",
    "Certainly",
    "My sources say yes",
    "Try again later",
    "Without a doubt",
    "Better not to tell you now"
  ],

  // Enable or disable music commands with "true" or "false"
  musicEnabled: "true",

  // Default per-server settings. All new guilds have these settings.
  // DO NOT LEAVE ANY OF THESE BLANK, AS YOU WILL NOT BE ABLE TO UPDATE THEM
  // VIA COMMANDS IN THE GUILD.

  defaultSettings: {
    prefix: ".",
    modLogChannel: "mod-log",
    modRole: "Moderator",
    adminRole: "Admin",
    systemNotice: "true", // This gives a notice when a user tries to run a command that they do not have permission to use.
    welcomeChannel: "welcome",
    welcomeMessage:
      "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
    welcomeEnabled: "false",
    swearFilter: "false",
    swearWords: ["fuck, shit, bitch"], // An array of swear words. These should be lowercase. (of course, I have not included much for certain reasons...)
    logCommandUsage: "true",
    sendHelp: "dm" // Available options: channel, dm
  },

  // Default per-server settings. ALL NEW GUILDS HAVE THESE SETTINGS.
  // These are all turned off by default so guild owners can personalise
  // these settings to their own liking for their server

  auditSettings: {
    logMemberAdd: "false",
    logMemberRemove: "false",
    logDeletes: "false",
    logCommandUsage: "false",
    logBans: "false"
  },

  // Dashboard settings
  // You can leave these settings blank if you want to disable the dashbaord
  // See the wiki on putting the dashboard on your domain: https://github.com/LeoDoesThings/ShpeeBot/wiki

  dashboard: {
    // Enable or disable the dashboard with "true" or "false"
    enabled: "true",

    // Your bots client secret. Available on https://discord.com/developers/applications/me
    oauthSecret: process.env.SECRET,

    // HTTPS: 'true' for true, 'false' for false. Preferably set this to true for obvious reaons.
    secure: "true",

    // Randomly generate a number to use as a session secret
    // A session secret is used to encrypt cookies, so you want this to be something that can't be guessed easily
    sessionSecret: Math.random(),

    // Domain name (with port if not running behind proxy running on port 80). Example: 'dashboard.bot-website.com' OR 'localhost:33445'
    domain: "shpeebot4.glitch.me",

    // The port the dashboard will run on
    port: "3000",

    // The permissions the bot will need on the server.
    // For more info see: https://finitereality.github.io/permissions-calculator/?v=536079575
    invitePerm: "536079575",

    // Whether or not to require a login to see bot statistics
    protectStats: "true",

    // This information will be shown on the Terms and Privacy pages
    // You'll want to fill these in if you don't want any legal issues...
    legalTemplates: {
      // This email will be used in the legal page of the dashboard if someone needs to contact you for any reason regarding this page
      contactEmail: "leo@leodt.xyz",
      // Change this if you update the `TERMS.md` or `PRIVACY.md` files in `dashboard/public/`
      lastEdited: "26 October 2020"
    }
  },

  // PERMISSION LEVEL DEFINITIONS.

  permLevels: [
    // This is the lowest permisison level, this is for non-roled users.
    {
      level: 0,
      name: "User",
      // Don't bother checking, just return true which allows them to execute any command their
      // level allows them to.
      check: () => true
    },

    // This is your permission level, the staff levels should always be above the rest of the roles.
    {
      level: 2,
      // This is the name of the role.
      name: "Moderator",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: message => {
        try {
          const modRole = message.guild.roles.cache.find(
            r => r.name.toLowerCase() === message.settings.modRole.toLowerCase()
          );
          if (modRole && message.member.roles.cache.has(modRole.id))
            return true;
        } catch (e) {
          return false;
        }
      }
    },

    {
      level: 3,
      name: "Administrator",
      check: message => {
        try {
          const adminRole = message.guild.roles.cache.find(
            r =>
              r.name.toLowerCase() === message.settings.adminRole.toLowerCase()
          );
          return adminRole && message.member.roles.cache.has(adminRole.id);
        } catch (e) {
          return false;
        }
      }
    },
    // This is the server owner.
    {
      level: 4,
      name: "Server Owner",
      // Simple check, if the guild owner id matches the message author's ID, then it will return true.
      // Otherwise it will return false.
      check: message =>
        message.channel.type === "text"
          ? message.guild.ownerID === message.author.id
            ? true
            : false
          : false
    },

    // Bot Support is a special inbetween level that has the equivalent of server owner access
    // to any server they joins, in order to help troubleshoot the bot on behalf of owners.
    {
      level: 8,
      name: "Bot Support",
      // The check is by reading if an ID is part of this array. Yes, this means you need to
      // change this and reboot the bot to add a support user. Make it better yourself!
      check: message => config.support.includes(message.author.id)
    },

    // Bot Admin has some limited access like rebooting the bot or reloading commands.
    {
      level: 9,
      name: "Bot Admin",
      check: message => config.admins.includes(message.author.id)
    },

    // This is the bot owner, this should be the highest permission level available.
    // The reason this should be the highest level is because of dangerous commands such as eval
    // or exec (if the owner has that).
    {
      level: 10,
      name: "Bot Owner",
      // Another simple check, compares the message author id to the one stored in the config file.
      check: message => message.client.config.ownerID === message.author.id
    }
  ]
};

module.exports = config;
