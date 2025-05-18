using AdventureWorksLT2019.EFDbContext;
using AdventureWorksLT2019.Models;
using AdventureWorksLT2019.Shared;

namespace AdventureWorksLT2019.RepositoriesInterfaces
{
    public interface IErrorLogRepository
    {
        Task AddAsync(ErrorLog errorLog);
        Task DeleteAsync(int id);
        Task<IEnumerable<ErrorLog>> GetAllAsync();
        Task<ErrorLog?> GetByIdAsync(int id);
        Task UpdateAsync(ErrorLog errorLog);
        Task<PagedResult<ErrorLog>> SearchAsync(ErrorLogQuery query);
    }
}