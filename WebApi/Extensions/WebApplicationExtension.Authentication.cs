using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace AdventureWorksLT2019.WebApi
{
    public static class WebApplicationExtension
    {
        public static void AddCustomAuthenticationApiEndpoints(this WebApplication app)
        {
            app.MapPost("/GoogleCallBack", async ([FromBody] GoogleTokenResponse googleTokenResponse) =>
            {
                var googleUserInfoUrl = $"https://www.googleapis.com/oauth2/v1/userinfo?access_token={googleTokenResponse.AccessToken}";
                var httpClient = new HttpClient();

                var response = await httpClient.GetAsync(googleUserInfoUrl);
                if (!response.IsSuccessStatusCode)
                    throw new Exception($"{response.StatusCode}: {response.ReasonPhrase}");
                var responseObject = await response.Content.ReadFromJsonAsync<GoogleUserInfoModel>();

                using (var scope = app.Services.CreateScope())
                {
                    var _userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
                    var user = await _userManager.FindByEmailAsync(responseObject!.Email!);
                    if (user == null)
                    {
                        var result = await _userManager.CreateAsync(new IdentityUser { Email = responseObject!.Email!, UserName = responseObject.Email }, (new Guid()).ToString() + "Asfd~12");
                        user = await _userManager.FindByEmailAsync(responseObject!.Email!);
                        //await _userManager.AddToRoleAsync(user!, AspNetRolesOptions.BasicUser.ToString());
                    }

                    var claimsPrincipal = new ClaimsPrincipal(
                      new ClaimsIdentity(
                        new[] { new Claim(ClaimTypes.Name, responseObject!.Email!) },
                        IdentityConstants.BearerScheme
                      )
                    );

                    return await Task.FromResult(Results.SignIn(claimsPrincipal));
                }
            });

            app.MapPost("/GetTempToken", async () =>
            {
                var claimsPrincipal = GetTempTokenClaimsPrincipal();

                return await Task.FromResult(Results.SignIn(claimsPrincipal));
            });

            app.MapPost("/Logout", async () =>
            {
                using (var scope = app.Services.CreateScope())
                {
                    var _signInManager = scope.ServiceProvider.GetRequiredService<SignInManager<IdentityUser>>();
                    await _signInManager.SignOutAsync();
                    var claimsPrincipal = GetTempTokenClaimsPrincipal();
                    return await Task.FromResult(Results.SignIn(claimsPrincipal));
                }
            }).RequireAuthorization();



            app.MapGet("/GetUserProfile", async (ClaimsPrincipal user) =>
            {
                using (var scope = app.Services.CreateScope())
                {
                    var _userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
                    var _signInManager = scope.ServiceProvider.GetRequiredService<SignInManager<IdentityUser>>();
                    var curUser = await _userManager.GetUserAsync(user);
                    var roles = await _userManager.GetRolesAsync(curUser!);

                    var response = new
                    {
                        Email = curUser?.Email,
                        UserName = curUser?.UserName,
                        Roles = roles,
                    };

                    return await Task.FromResult(response);
                }
            }).RequireAuthorization();

            //app.MapPost("/GetUserInfo", async (ClaimsPrincipal user) =>
            //{
            //    using (var scope = app.Services.CreateScope())
            //    {
            //        var _userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
            //        var _claimService = scope.ServiceProvider.GetRequiredService<ClaimService>();
            //        var _notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
            //        var _personService = scope.ServiceProvider.GetRequiredService<IPersonService>();
            //        var _signInManager = scope.ServiceProvider.GetRequiredService<SignInManager<IdentityUser>>();
            //        var claimsModel = _claimService.GetFromClaimPrinciple(user);
            //        var curUser = await _userManager.GetUserAsync(user);
            //        var roles = await _userManager.GetRolesAsync(curUser!);
            //        var response = new UserInfo
            //        {
            //            Roles = roles,
            //        };

            //        var personResponse = await _personService.Get(new PersonIdentifier { EntityID = claimsModel.PersonID }, null); // no ClaimsModel for now
            //        if (personResponse.Status == System.Net.HttpStatusCode.OK)
            //        {
            //            response.Person = personResponse.ResponseBody;

            //            // Please manually match which column is the PersonId in Notification table
            //            var notificationsResponse = await _notificationService.Search(new NotificationAdvancedQuery { EntityID = claimsModel.PersonID }, null); // no ClaimsModel for now
            //            if (notificationsResponse.Status == System.Net.HttpStatusCode.OK)
            //            {
            //                response.Notifications = notificationsResponse.ResponseBody;
            //            }
            //        }
            //        var claims = await _userManager.GetClaimsAsync(curUser!);
            //        if (claims.Any(t => t.Type == ClaimTypes.UserData))
            //        {
            //            var userDataInString = claims.First(t => t.Type == ClaimTypes.UserData).Value;
            //            response.UserData = JsonSerializer.Deserialize<UserData>(userDataInString, new JsonSerializerOptions() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            //        }

            //        return await Task.FromResult(response);
            //    }
            //}).RequireAuthorization();
        }

        private static ClaimsPrincipal GetTempTokenClaimsPrincipal()
        {
            return new ClaimsPrincipal(
              new ClaimsIdentity(
                new[]
                {
                        new Claim(ClaimTypes.Name, Guid.NewGuid().ToString()),
                        new Claim(ClaimTypes.Role, "Visitor")
                },
                IdentityConstants.BearerScheme
              )
            );
        }
    }
    //public class UserInfo
    //{
    //    public IList<string>? Roles { get; set; }
    //    public PersonDataModel.DefaultView? Person { get; set; }
    //    public NotificationDataModel.DefaultView[]? Notifications { get; set; }
    //    public UserData? UserData { get; set; }
    //}
    public class TokenResponse
    {
        public string TokenType { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
        public int ExpiresIn { get; set; } = 0;
        public string RefreshToken { get; set; } = string.Empty;
    }
    public class GoogleTokenResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; } = string.Empty;
        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; set; } = 0;

        [JsonPropertyName("hd")]
        public string? HD { get; set; }

        [JsonPropertyName("prompt")]
        public string? Prompt { get; set; }

        [JsonPropertyName("token_type")]
        public string? TokenType { get; set; }

        [JsonPropertyName("scope")]
        public string? Scope { get; set; }

        [JsonPropertyName("state")]
        public string? State { get; set; }
    }
    public class GoogleUserInfoModel
    {
        [JsonPropertyName("iss")]
        public string? Issuer { get; set; }
        [JsonPropertyName("nbf")]
        public long? Nbf { get; set; }
        [JsonPropertyName("aud")]
        public string? Audience { get; set; }
        [JsonPropertyName("sub")]
        public string? Sub { get; set; }
        [JsonPropertyName("email")]
        public string? Email { get; set; } = null!;
        [JsonPropertyName("email_verified")]
        public bool? EmailVerified { get; set; }
        [JsonPropertyName("azp")]
        public string? Azp { get; set; }
        [JsonPropertyName("name")]
        public string? Name { get; set; }
        [JsonPropertyName("picture")]
        public string? Picture { get; set; }
        [JsonPropertyName("given_name")]
        public string? GivenName { get; set; }
        [JsonPropertyName("family_name")]
        public string? FamilyName { get; set; }
        [JsonPropertyName("iat")]
        public long? iat { get; set; }
        [JsonPropertyName("exp")]
        public long? exp { get; set; }
        [JsonPropertyName("jti")]
        public string? Jti { get; set; }
    }
}