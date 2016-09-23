using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;

namespace BountyHunterCSharp.Models
{

    //Abstract Character class with properties (Name, Race, Type) (Use Enum)
    ///Create a Jedi Class which inherits from Character and introduces a LightSaborColor property.
    ///Create a BountyHunter Class which inherits from Character, and introduces a property of WeaponType.
    ///On the index view, use Polymorphism to make a list of type Characters that holds all Jedi and BountyHunters.
    ///
    ///Create a Jedi view that uses LINQ to filter the Character List to only show the Jedi. Type cast the filtered list 
    ///back to Jedi to allow you to see the LightSaberColor property.
    ///
    /// Create a BounterHunter view that uses LINQ to filter the Character List to only show the Bounty Hunters. Type case the filtered list back
    /// to Jedi to allow you to see the WeaponType.

    public abstract class Character
    {

        public enum CharacterType //Create your own "dataType" //typeSafe
        {
            JediKnight,
            BountyHunterX
        };

        public string Name { get; set; }
        public string Race { get; set; }
        public CharacterType Type { get; set; }


        public Character(string name, string race, CharacterType type) //Big fucking 3 day lesson, your base constructor must have arguments set equal to the properties names in it's body
        {
            Name = name;
            Race = race;
            Type = type;
        }


        public Character() //What is this for?
        {
        }
        //}  //There's a pattern of us creating an empty method which matches the class name its


    }
}