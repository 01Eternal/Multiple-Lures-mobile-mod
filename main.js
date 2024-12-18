import { using } from './ModClasses.js';

using('Terraria');
using('Terraria.Chat');
using('Microsoft.Xna.Framework')
using('Microsoft.Xna.Framework.Graphics')

let NewCombatText =
    CombatText[
        "int NewText(Rectangle location, Color color, string text, bool dramatic, bool dot)"
    ];
    
let activeBait = 0;
let quantityBait = 0;


const Vector2_New =(x, y) => {
    return Vector2.new()['void .ctor(float x, float y)'](x,y)
}
/**
 * @todo Saves the current configuration to the "ModConfig.json" file.
 * @see https://github.com/TerLauncher/TL-Mods/wiki/JavaScript-API#tl.mod.dataDirectory
 */
function loadConfig() {
    if (tl.file.exists("ModConfig.json")) {
        try {
            const configData = JSON.parse(tl.file.read("ModConfig.json"));
            quantityBait = configData.quantityBait || 0;
            tl.log(`[Multiple Lures]: ModConfig Loaded.`);
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
            let BaitsText = parseInt(command.split(" ")[1]);
            if (!isNaN(BaitsText)) {
                if (BaitsText >= 55) BaitsText = 55
                
                NewCombatText(
                    Main.player[0].getRect(),
                    Color.Blue,
                    `Baits have been changed to ${BaitsText}`,
                    true,
                    false
                ); 
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

            Array.from(Main.projectile).forEach(projectile => {
                if (amount <= 0) return;
                    if (sItem.fishingPole > 0 && amount > 0 && projectile.bobber) {
                    
                    Projectile['int NewProjectile(IEntitySource spawnSource, Vector2 position, Vector2 velocity, int Type, int Damage, float KnockBack, int Owner, float ai0, float ai1, float ai2)'](
                        Projectile.GetNoneSource(),
                        projectile.position = Main.player[0].direction == 1 ? Vector2_New(projectile.position.X + 15, projectile.position.Y + 2): projectile.position,
                        projectile.velocity,
                        sItem.shoot,
                        0,
                        0,
                        Main.myPlayer,
                        0, 0, 0
                    );
    
                    amount--;
                }
            });
        }

    MultiplyBaits(quantityBait);
});

loadConfig();
