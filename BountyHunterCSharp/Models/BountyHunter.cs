using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BountyHunterCSharp.Models
{
    public class BountyHunter : Character
    {
        public string WeaponType { get; set; }

        public BountyHunter(string name, string race, CharacterType type, string weaponType)
            : base(name, race, type)
        {
            WeaponType = weaponType;
        }


        public BountyHunter() { } //No need for this? This errors when I delete the empty one in the Character Class. Although it had 0 references, it will give error through type safety. Al
        //Also because this inherits from the abstract, it will look for a base constructor to inherit from and if I comment out the empty base constructor, this will throw an errorrrrr.

    }
}