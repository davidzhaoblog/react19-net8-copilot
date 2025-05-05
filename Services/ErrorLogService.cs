using AdventureWorksLT2019.EFDbContext;
using AdventureWorksLT2019.RepositoriesInterfaces;
using AdventureWorksLT2019.ServiceInterfaces;

namespace AdventureWorksLT2019.Services
{
    public class ErrorLogService : IErrorLogService
    {
        private readonly IErrorLogRepository _errorLogRepository;

        public ErrorLogService(IErrorLogRepository errorLogRepository)
        {
            _errorLogRepository = errorLogRepository;
        }

        public async Task<IEnumerable<ErrorLog>> GetAllAsync()
        {
            return await _errorLogRepository.GetAllAsync();
        }

        public async Task<ErrorLog?> GetByIdAsync(int id)
        {
            return await _errorLogRepository.GetByIdAsync(id);
        }

        public async Task AddAsync(ErrorLog errorLog)
        {
            await _errorLogRepository.AddAsync(errorLog);
        }

        public async Task UpdateAsync(ErrorLog errorLog)
        {
            await _errorLogRepository.UpdateAsync(errorLog);
        }

        public async Task DeleteAsync(int id)
        {
            await _errorLogRepository.DeleteAsync(id);
        }
    }
}
