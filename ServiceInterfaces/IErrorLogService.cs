using AdventureWorksLT2019.EFDbContext;
using AdventureWorksLT2019.Models;
using AdventureWorksLT2019.Shared;

namespace AdventureWorksLT2019.ServiceInterfaces
{
    public interface IErrorLogService
    {
        Task<IEnumerable<ErrorLog>> GetAllAsync();
        Task<ErrorLog?> GetByIdAsync(int id);
        Task AddAsync(ErrorLog errorLog);
        Task UpdateAsync(ErrorLog errorLog);
        Task DeleteAsync(int id);
        Task<PagedResult<ErrorLog>> SearchAsync(ErrorLogQuery query);
    }
}
