using AdventureWorksLT2019.EFDbContext;
using AdventureWorksLT2019.Models;
using AdventureWorksLT2019.ServiceInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace AdventureWorksLT2019.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ErrorLogController : ControllerBase
    {
        private readonly IErrorLogService _errorLogService;

        public ErrorLogController(IErrorLogService errorLogService)
        {
            _errorLogService = errorLogService;
        }

        // [Authorize]
        // GET: api/ErrorLog
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var errorLogs = await _errorLogService.GetAllAsync();
            return Ok(errorLogs);
        }

        // GET: api/ErrorLog/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var errorLog = await _errorLogService.GetByIdAsync(id);
            if (errorLog == null)
                return NotFound($"ErrorLog with ID {id} not found.");

            return Ok(errorLog);
        }

        // POST: api/ErrorLog
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] ErrorLog errorLog)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _errorLogService.AddAsync(errorLog);
            return CreatedAtAction(nameof(GetById), new { id = errorLog.ErrorLogId }, errorLog);
        }

        // PUT: api/ErrorLog/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ErrorLog errorLog)
        {
            //if (id != errorLog.ErrorLogId)
            //    return BadRequest("ID mismatch.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingErrorLog = await _errorLogService.GetByIdAsync(id);
            if (existingErrorLog == null)
                return NotFound($"ErrorLog with ID {id} not found.");

            await _errorLogService.UpdateAsync(errorLog);
            return NoContent();
        }


        // PUT: api/ErrorLog/{id}/Resolve
        [HttpPut("{id}/Resolve")]
        public async Task<IActionResult> Resolve(int id)
        {
            //if (id != errorLog.ErrorLogId)
            //    return BadRequest("ID mismatch.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingErrorLog = await _errorLogService.GetByIdAsync(id);
            if (existingErrorLog == null)
                return NotFound($"ErrorLog with ID {id} not found.");
            existingErrorLog.ErrorState = Shared.ErrorLogState.Resolved;
            existingErrorLog.LastUpdated = DateTime.Now;
            await _errorLogService.UpdateAsync(existingErrorLog);
            return NoContent();
        }

        [HttpPatch("{id}")]
        [Consumes("application/json-patch+json")]
        public async Task<IActionResult> Patch(int id, [FromBody] JsonPatchDocument<ErrorLog> patchDoc)
        {
            if (patchDoc == null)
                return BadRequest();

            var errorLog = await _errorLogService.GetByIdAsync(id);
            if (errorLog == null)
                return NotFound($"ErrorLog with ID {id} not found.");

            patchDoc.ApplyTo(errorLog);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _errorLogService.UpdateAsync(errorLog);
            return NoContent();
        }

        // DELETE: api/ErrorLog/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingErrorLog = await _errorLogService.GetByIdAsync(id);
            if (existingErrorLog == null)
                return NotFound($"ErrorLog with ID {id} not found.");

            await _errorLogService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("Search")]
        public async Task<IActionResult> Search([FromQuery]ErrorLogQuery query)
        {
            var result = await _errorLogService.SearchAsync(query);
            return Ok(result);
        }
    }
}
