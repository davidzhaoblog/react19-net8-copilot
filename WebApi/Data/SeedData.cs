using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

namespace AdventureWorksLT2019.WebApi.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            // Define roles
            {
                var roles = new[] { "Owner", "Visitor", "Employee", "SystemAdmin", "BasicUser", "Consumer" };

                // Ensure roles exist
                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole(role));
                    }
                }
            }

            // 1. Create SystemAdministrator user
            {
                var userName = "admintest@exampletest.com";
                var password = "Te$t!234";
                var roles = new[] { "SystemAdmin" };
                await CreateUserAsync(userManager, userName, password, roles);
            }

            // 2. Create visitor user
            {
                var userName = "visitortest@exampletest.com";
                var password = "Te$t!234";
                var roles = new[] { "Visitor" };
                await CreateUserAsync(userManager, userName, password, roles);
            }
        }

        private static async Task CreateUserAsync(UserManager<IdentityUser> userManager, string userName, string password, string[] roles)
        {
            if (await userManager.FindByNameAsync(userName) == null)
            {
                var user = new IdentityUser
                {
                    UserName = userName,
                    Email = userName,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(user, password);
                if (result.Succeeded)
                {
                    foreach (var role in roles)
                    {
                        // Assign SystemAdmin role to the user
                        await userManager.AddToRoleAsync(user, role);
                    }
                }
                else
                {
                    throw new Exception($"Failed to create {userName} user: {string.Join(", ", result.Errors)}");
                }
            }
        }
    }
}
