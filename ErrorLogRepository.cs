using AdventureWorksLT2019.EFDbContext;
using Microsoft.EntityFrameworkCore;

namespace AdventureWorksLT2019.MSSqlRepositories
{
    public class ErrorLogRepository
    {
        private readonly AdventureWorksLT2019Context _context;

        public ErrorLogRepository(AdventureWorksLT2019Context context)
        {
            _context = context;
        }

        // Get all ErrorLogs
        public async Task<IEnumerable<ErrorLog>> GetAllAsync()
        {
            return await _context.ErrorLogs.ToListAsync();
        }

        // Get a single ErrorLog by ID
        public async Task<ErrorLog?> GetByIdAsync(int id)
        {
            return await _context.ErrorLogs.FindAsync(id);
        }

        // Add a new ErrorLog
        public async Task AddAsync(ErrorLog errorLog)
        {
            _context.ErrorLogs.Add(errorLog);
            await _context.SaveChangesAsync();
        }

        // Update an existing ErrorLog
        public async Task UpdateAsync(ErrorLog errorLog)
        {
            _context.ErrorLogs.Update(errorLog);
            await _context.SaveChangesAsync();
        }

        // Delete an ErrorLog by ID
        public async Task DeleteAsync(int id)
        {
            var errorLog = await _context.ErrorLogs.FindAsync(id);
            if (errorLog != null)
            {
                _context.ErrorLogs.Remove(errorLog);
                await _context.SaveChangesAsync();
            }
        }
    }
}
