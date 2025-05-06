//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;

//namespace AdventureWorksLT2019.WebApi.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class ExampleController : ControllerBase
//    {

//        [HttpPost("login")]
//        public async Task<IActionResult> Login([FromBody] LoginModel model, [FromServices] SignInManager<IdentityUser> signInManager)
//        {
//            var result = await signInManager.PasswordSignInAsync(model.Username, model.Password, isPersistent: false, lockoutOnFailure: false);
//            if (result.Succeeded)
//            {
//                return Ok("Login successful.");
//            }
//            return Unauthorized("Invalid login attempt.");
//        }

//        [HttpPost("logout")]
//        public async Task<IActionResult> Logout([FromServices] SignInManager<IdentityUser> signInManager)
//        {
//            await signInManager.SignOutAsync();
//            return Ok("Logout successful.");
//        }

//        [HttpGet]
//        public IActionResult Get()
//        {
//            return Ok("This is a protected endpoint.");
//        }
//    }
//}