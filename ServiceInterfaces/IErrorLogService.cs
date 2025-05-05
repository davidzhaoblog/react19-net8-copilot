using AdventureWorksLT2019.EFDbContext;

namespace AdventureWorksLT2019.ServiceInterfaces
{
    public interface IErrorLogService
    {
        Task<IEnumerable<ErrorLog>> GetAllAsync();
        Task<ErrorLog?> GetByIdAsync(int id);
        Task AddAsync(ErrorLog errorLog);
        Task UpdateAsync(ErrorLog errorLog);
        Task DeleteAsync(int id);
    }
}
