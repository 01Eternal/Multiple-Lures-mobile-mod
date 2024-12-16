import { using } from './ModClasses.js';

using('Terraria');
using('Terraria.Chat')

let activeBait = 0;
let quantityBait = 0


ChatCommandProcessor.ProcessIncomingMessage.hook(
    (original, self, message, client_id) => {
        original(self, message, client_id);

        const command = message.Text.toUpperCase();
        if (command.startsWith("/BAITS")) {
            const BaitsText = parseInt(command.split(" ")[1]);
            if (!isNaN(BaitsText)) {
                quantityBait = BaitsText
            }
        }
    }
);

Player.ItemCheck_Shoot.hook((orig, self, i, sItem, weaponDamage) => {
    orig(self, i, sItem, weaponDamage);


    /* 
    * @param {number} amount
    * @returns Bait multiplicate by amount
    */
    function MultiplyBaits(amount = 0) {
        activeBait = amount;
        if (sItem.fishingPole > 0) {
                Array.from(Main.projectile).forEach(projectile => {
                amount--;
                if (amount <= 0) return
                
                    Projectile['int NewProjectile(IEntitySource spawnSource, Vector2 position, Vector2 velocity, int Type, int Damage, float KnockBack, int Owner, float ai0, float ai1, float ai2)'](
                        Projectile.GetNoneSource(),
                        projectile.position,
                        projectile.velocity,
                        sItem.shoot,
                        0,
                        0,
                        Main.projectile.owner,
                        0, 0, 0
                    );
                })
            }
        }

    MultiplyBaits(quantityBait);
});

