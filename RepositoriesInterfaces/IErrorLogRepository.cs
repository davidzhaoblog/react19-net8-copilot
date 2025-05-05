using AdventureWorksLT2019.EFDbContext;

namespace AdventureWorksLT2019.RepositoriesInterfaces
{
    public interface IErrorLogRepository
    {
        Task AddAsync(ErrorLog errorLog);
        Task DeleteAsync(int id);
        Task<IEnumerable<ErrorLog>> GetAllAsync();
        Task<ErrorLog?> GetByIdAsync(int id);
        Task UpdateAsync(ErrorLog errorLog);
    }
}