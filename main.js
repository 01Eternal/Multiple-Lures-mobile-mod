import { using } from './ModClasses.js';

using('Terraria');
using('Terraria.Chat');

let activeBait = 0;
let quantityBait = 0;



/**
 * @todo Saves the current configuration to the "ModConfig.json" file.
 * @see https://github.com/TerLauncher/TL-Mods/wiki/JavaScript-API#tl.mod.dataDirectory
 */
function loadConfig() {
    if (tl.file.exists("ModConfig.json")) {
        try {
            const configData = JSON.parse(tl.file.read("ModConfig.json"));
            quantityBait = configData.quantityBait || 0;
            tl.log(`[Multiple Lures]: baits ${quantityBait} Loaded.`);
        } catch (error) {
            quantityBait = 0;
        }
    } else {
        saveConfig();
    }
}

/**
 * @todo Loads the configuration from the "ModConfig.json" file, If the file does not exist, it creates a new one with default values.
 * @see https://github.com/TerLauncher/TL-Mods/wiki/JavaScript-API#tl.mod.dataDirectory
 */
function saveConfig() {
    const configData = { quantityBait };
    tl.file.write("ModConfig.json", JSON.stringify(configData, null, 4));
    tl.log(`[Multiple Lures]: baits ${quantityBait} Saved.`);
}

ChatCommandProcessor.ProcessIncomingMessage.hook(
    (original, self, message, client_id) => {
        original(self, message, client_id);

        const command = message.Text.toUpperCase();
        if (command.startsWith("/BAITS")) {
            const BaitsText = parseInt(command.split(" ")[1]);
            if (!isNaN(BaitsText)) {
                quantityBait = BaitsText;
                saveConfig();
            }
        }
    }
);

Player.ItemCheck_Shoot.hook((orig, self, i, sItem, weaponDamage) => {
    orig(self, i, sItem, weaponDamage);

    /* 
    * @param {number} amount
    * @returns {number} Bait multiplicate by amount
    */
    function MultiplyBaits(amount = 0) {
        activeBait = amount;

        if (sItem.fishingPole > 0 && amount > 0) {
            Array.from(Main.projectile).forEach(projectile => {
                if (amount <= 0) return;

                Projectile['int NewProjectile(IEntitySource spawnSource, Vector2 position, Vector2 velocity, int Type, int Damage, float KnockBack, int Owner, float ai0, float ai1, float ai2)'](
                    Projectile.GetNoneSource(),
                    projectile.position,
                    projectile.velocity,
                    sItem.shoot,
                    0,
                    0,
                    Main.myPlayer,
                    0, 0, 0
                );

                amount--;
            });
        }
    }

    MultiplyBaits(quantityBait);
});

loadConfig();
