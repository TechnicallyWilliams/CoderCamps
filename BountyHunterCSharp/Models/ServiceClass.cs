using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BountyHunterCSharp.Models
{
    public sealed class ServiceClass
    {

        //This lazy instance will work with the service type (the lazy singleton)
        private static readonly Lazy<ServiceClass> lazy = new Lazy<ServiceClass>(() => new ServiceClass()); //same thing as a callback //used to be private
        //instantaite an object called a lazy, have it represent our class called service signletong , then the constructor for the function we want it to have a parameter. That parameter in the future will instnatiate a function called a service sisngleton below. (private)
        //static is read first when the app runs before anything else

        private List<Character> Characters = new List<Character>();
        private List<Character> NiceCharacters = new List<Character>();
        private List<Character> MasterList = new List<Character>();

        public static ServiceClass Instance { get { return lazy.Value; } } //Moved this to the top of the class. This is the only thing you can call in the other page. Static allows you not to create multiples.

        private ServiceClass() //You can have the class itself return a list. Realize this just returns the list when you call the method
        {
            createList();

        }



        public List<Character> ReturnList() //If I just use void, I can then separate this from doing an add and return at the same time
        {            
            return Characters;
        }

        public List<Character> ReturnNiceList()
        {
            return NiceCharacters;
        }

        public List<Character> ReturnAll()
        {   
            return MasterList;
        }

        private void createList() //Used to be private //adding it to the list inside this method loses all the property values
        {
            BountyHunter CharacterOne = new BountyHunter("Ganon", "Exotype", Character.CharacterType.BountyHunterX, "Rifle"); //This type of instantiation needs a constructor in the other class with properties set to the arguments in the body
            BountyHunter CharacterTwo = new BountyHunter("Sephiroth", "Exobase", Character.CharacterType.BountyHunterX, "Lazer");
            BountyHunter CharacterThree = new BountyHunter("Madara", "Earthling", Character.CharacterType.JediKnight, "Sword-Gun");

            Jedi CharacterFour = new Jedi("Luke", "Earthling", Character.CharacterType.JediKnight, "Blue"); //A reminder that order matters.
            Jedi CharacterFive = new Jedi("Anakin", "Earthling", Character.CharacterType.JediKnight, "Green");
            Jedi CharacterSix = new Jedi("Tiger", "Earthling", Character.CharacterType.JediKnight, "Black"); //This forces behavior because the constructor in the child classes exist

            Characters.Add(CharacterOne);
            Characters.Add(CharacterTwo);
            Characters.Add(CharacterThree);

            NiceCharacters.Add(CharacterFour);
            NiceCharacters.Add(CharacterFive);
            NiceCharacters.Add(CharacterSix);

            foreach (Character entity in Characters)
            {
                MasterList.Add(entity);
            }

            foreach (Character entity2 in NiceCharacters)
            {
                MasterList.Add(entity2);
            }

        }


        public void AddToCharacters(BountyHunter model) //Add this last minute but IDK why.
        {
            Characters.Add(model);
            MasterList.Add(model);
        }


        public void AddToNiceCharacters(Jedi model) //Add this last minute but IDK why.
        {
            NiceCharacters.Add(model);
            MasterList.Add(model);
        }

    }

    }
