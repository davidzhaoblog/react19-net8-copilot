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
            var roles = new[] { "Owner", "Visitor", "Employee", "SystemAdmin", "BasicUser", "Consumer" };

            // Ensure roles exist
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Create SystemAdministrator user
            var adminUserName = "SystemAdministrator";
            var adminPassword = "Te$t~123";

            if (await userManager.FindByNameAsync(adminUserName) == null)
            {
                var adminUser = new IdentityUser
                {
                    UserName = adminUserName,
                    Email = "admin@example.com",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);
                if (result.Succeeded)
                {
                    // Assign SystemAdmin role to the user
                    await userManager.AddToRoleAsync(adminUser, "SystemAdmin");
                }
                else
                {
                    throw new Exception($"Failed to create SystemAdministrator user: {string.Join(", ", result.Errors)}");
                }
            }
        }
    }
}
