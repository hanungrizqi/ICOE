using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ICOE.Startup))]
namespace ICOE
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
