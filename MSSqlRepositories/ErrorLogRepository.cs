using AdventureWorksLT2019.EFDbContext;
using AdventureWorksLT2019.Models;
using AdventureWorksLT2019.RepositoriesInterfaces;
using AdventureWorksLT2019.Shared;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

namespace AdventureWorksLT2019.MSSqlRepositories
{
    public class ErrorLogRepository : IErrorLogRepository
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

        public async Task<AdventureWorksLT2019.Shared.PagedResult<ErrorLog>> SearchAsync(ErrorLogQuery query)
        {
            IQueryable<ErrorLog> q = SearchQuery(query);

            var orderBy = OrderByUtility.ParseOrderBy(query.OrderBy);
            // Apply ordering
            if (!string.IsNullOrEmpty(orderBy))
            {
                q = q.OrderBy(orderBy);
            }
            else
            {
                // Default ordering
                q = q.OrderByDescending(e => e.ErrorTime);
            }

            // Pagination
            q = q.Skip(query.PageIndex * query.PageSize).Take(query.PageSize);

            IQueryable<ErrorLog> qCount = SearchQuery(query);
            var result = new AdventureWorksLT2019.Shared.PagedResult<ErrorLog>
            {
                TotalCount = await qCount.CountAsync(),
                PageIndex = query.PageIndex,
                PageSize = query.PageSize,
                Items = await q.ToListAsync()
            };

            return result;
        }

        private IQueryable<ErrorLog> SearchQuery(ErrorLogQuery query)
        {
            var q = _context.ErrorLogs.AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Text))
            {
                q = q.Where(e =>
                    e.UserName.Contains(query.Text) ||
                    e.ErrorMessage.Contains(query.Text) ||
                    (e.ErrorProcedure != null && e.ErrorProcedure.Contains(query.Text)));
            }

            if (query.ErrorTimeFrom.HasValue)
                q = q.Where(e => e.ErrorTime >= query.ErrorTimeFrom.Value);

            if (query.ErrorTimeTo.HasValue)
                q = q.Where(e => e.ErrorTime <= query.ErrorTimeTo.Value);

            if (query.ErrorSeverities != null && query.ErrorSeverities.Any())
                q = q.Where(e => query.ErrorSeverities.Contains(e.ErrorSeverity ?? 0));

            if (query.ErrorStates != null && query.ErrorStates.Any())
                q = q.Where(e => query.ErrorStates.Contains(e.ErrorState ?? 0));
            return q;
        }
    }
}
