using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(WishHeroes.Startup))]
namespace WishHeroes
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
