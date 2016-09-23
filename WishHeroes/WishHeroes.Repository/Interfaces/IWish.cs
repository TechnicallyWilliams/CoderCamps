using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WishHeroes.Data.Models;
using WishHeroes.ViewModels;

namespace WishHeroes.Repository.Interfaces
{
    public interface IWish
    {
        WishViewModel GetRandomWish();
        WishReport GetWishReport(int id);
        void Add(AddWishViewModel Model);
    }
}
