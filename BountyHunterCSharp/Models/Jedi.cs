using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BountyHunterCSharp.Models
{
    public class Jedi : Character
    {                                   //private means you can't use it in another class
        public string LightSaberColor { get; set; }
        
        public Jedi(string name, string race, CharacterType type, string lightSaberColor) 
            : base(name, race, type)
        {
            LightSaberColor = lightSaberColor;
        }

        public Jedi() {} //

    }
 
}
